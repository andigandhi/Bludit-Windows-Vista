class WindowManager {
  constructor({ taskbarSelector = '#taskbar', menuSelector = '#mainMenu', menuContentSelector = '#menu_content', desktopSelector = 'body' } = {}) {
    this.taskbar = document.querySelector(taskbarSelector);
    this.menu = document.querySelector(menuSelector);
    this.menuContent = document.querySelector(menuContentSelector);
    this.desktop = document.querySelector(desktopSelector);

    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.isMobile = (window.innerWidth < window.innerHeight);
    this.windows = new Map();

    this.TITLE_BAR_HEIGHT = 35;
    this.TASKBAR_HEIGHT = 50;
    this.defaultSize = [816, 480];

    window.addEventListener('resize', () => this.updateDimensions());
    this.positionTaskbar();
    this.initMenuToggle();
  }

  updateDimensions() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.isMobile = (window.innerWidth < window.innerHeight);
    this.positionTaskbar();
  }

  positionTaskbar() {
    this.taskbar.style.marginTop = `${this.screenHeight - this.TASKBAR_HEIGHT}px`;
    const menuHeight = this.menu.offsetHeight;
    this.menu.style.marginTop = `${this.screenHeight - this.TASKBAR_HEIGHT - menuHeight}px`;
  }

  initMenuToggle() {
    const menuButton = document.getElementById('taskMenBtn');
    if (menuButton) {
      menuButton.addEventListener('click', () => {
        const isHidden = this.menu.style.visibility === 'hidden';
        this.menu.style.visibility = isHidden ? '' : 'hidden';
        menuButton.classList.toggle('active', isHidden);
      });
    }
  }

  generateId() {
    return 'window-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
  }

  constrainSize(width, height) {
    return {
      width: Math.min(width, this.screenWidth),
      height: Math.min(height, this.screenHeight - this.TASKBAR_HEIGHT),
    };
  }

  createWindowElement({ id, title, icon, width, height, left, top, content }) {
    const windowDiv = document.createElement('div');
    windowDiv.className = 'window glass active';
    windowDiv.id = id;
    Object.assign(windowDiv.style, {
      position: 'absolute',
      width: `${width}px`,
      height: `${height + this.TITLE_BAR_HEIGHT}px`,
      left: `${left}px`,
      top: `${top}px`,
    });

    // Title Bar
    const titleBar = document.createElement('div');
    titleBar.className = 'title-bar';

    const titleText = document.createElement('div');
    titleText.className = 'title-bar-text';
    const img = document.createElement('img');
    img.src = icon;
    img.alt = '';
    img.style.cssText = 'height: 11px; margin-right: 5px; float: left;';
    titleText.append(img, document.createTextNode(title));

    const controls = document.createElement('div');
    controls.className = 'title-bar-controls';

    const minimizeBtn = this.createButton('Minimize', () => this.toggleWindow(id));
    const maximizeBtn = this.createButton('Maximize', () => this.resizeWindow(id));
    maximizeBtn.id = `btn-resize-${id}`;
    const closeBtn = this.createButton('Close', () => this.removeWindow(id));

    controls.append(minimizeBtn, maximizeBtn, closeBtn);

    titleBar.append(titleText, controls);
    windowDiv.appendChild(titleBar);

    // Window Body
    const windowBody = document.createElement('div');
    windowBody.className = 'window-body';
    Object.assign(windowBody.style, {
      position: 'relative',
      height: `${height}px`,
      overflow: 'hidden',
    });
    windowBody.appendChild(content);
    windowDiv.appendChild(windowBody);

    addMoveListeners(windowDiv, titleBar);
    this.desktop.appendChild(windowDiv);

    return windowDiv;
  }

  createButton(ariaLabel, onClick) {
    const btn = document.createElement('button');
    btn.setAttribute('aria-label', ariaLabel);
    btn.addEventListener('click', onClick);
    return btn;
  }

  createTaskbarItem(id, icon, title) {
    const btn = document.createElement('button');
    btn.id = `${id}-t`;
    btn.className = 'taskElement active';
    btn.style.cssText = 'white-space:nowrap; overflow: hidden;';
    btn.addEventListener('click', () => this.toggleWindow(id));

    const img = document.createElement('img');
    img.src = icon;
    img.alt = title;
    img.className = 'taskElementImg';

    btn.appendChild(img);
    this.taskbar.appendChild(btn);
    return btn;
  }

  addWindow({ title, icon, link, size = this.defaultSize, position }) {
    const id = this.generateId();

    let width = size[0];
    let height = size[1];
    let left, top;

    ({ width, height } = this.constrainSize(width, height));

    if (!position) {
      left = Math.floor(Math.random() * (this.screenWidth - width));
      top = Math.floor(Math.random() * (this.screenHeight - height - this.TASKBAR_HEIGHT));
    } else {
      [left, top] = position;
    }

    const iframe = document.createElement('iframe');
    iframe.className = 'window-content';
    iframe.width = `${width - 16}px`;
    iframe.height = `${height}px`;
    iframe.src = link;
    iframe.frameBorder = '0';
    iframe.allowFullscreen = true;

    const windowEl = this.createWindowElement({
      id,
      title,
      icon,
      width,
      height,
      left,
      top,
      content: iframe,
    });

    const taskbarItem = this.createTaskbarItem(id, icon, title);

    this.windows.set(id, { windowEl, taskbarItem });
    return id;
  }

  resizeWindow(id) {
    const { windowEl } = this.windows.get(id);
    const resizeBtn = document.getElementById(`btn-resize-${id}`);

    if (windowEl.style.width === '100%') {
      let width, height;
      ({ width, height } = this.constrainSize(this.defaultSize[0], this.defaultSize[1] + this.TITLE_BAR_HEIGHT));
      Object.assign(windowEl.style, {
        width: `${width}px`,
        height: `${height}px`,
        top: `${Math.floor(Math.random() * (this.screenHeight - height - this.TASKBAR_HEIGHT))}px`,
        left: `${Math.floor(Math.random() * (this.screenWidth - width))}px`,
      });
      resizeBtn.setAttribute('aria-label', 'Maximize');
    } else {
      Object.assign(windowEl.style, {
        width: '100%',
        height: `${this.screenHeight - this.TASKBAR_HEIGHT}px`,
        top: '0',
        left: '0',
      });
      resizeBtn.setAttribute('aria-label', 'Restore');
    }

    const iframe = windowEl.querySelector('.window-content');
    const windowBody = windowEl.querySelector('.window-body');
    iframe.width = windowEl.clientWidth - 16;
    iframe.height = windowEl.clientHeight - this.TITLE_BAR_HEIGHT;
    windowBody.style.height = `${windowEl.clientHeight - this.TITLE_BAR_HEIGHT}px`;
  }

  removeWindow(id) {
    const { windowEl, taskbarItem } = this.windows.get(id);
    windowEl.remove();
    taskbarItem.remove();
    this.windows.delete(id);
  }

  toggleWindow(id) {
    const { windowEl, taskbarItem } = this.windows.get(id);
    if (windowEl.style.visibility === 'hidden') {
      windowEl.style.visibility = '';
      taskbarItem.classList.add('active');
      windowEl.classList.add('active');
    } else {
      windowEl.style.visibility = 'hidden';
      taskbarItem.classList.remove('active');
      windowEl.classList.remove('active');
    }
  }

  addDragListeners(windowEl, titleBar) {
    let offsetX = 0, offsetY = 0, isDragging = false;

    titleBar.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - windowEl.offsetLeft;
      offsetY = e.clientY - windowEl.offsetTop;
      windowEl.style.zIndex = this.zMax;
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        windowEl.style.left = `${e.clientX - offsetX}px`;
        windowEl.style.top = `${e.clientY - offsetY}px`;
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

  // Add desktop icon
  addDesktopIcon({ title, link, icon }) {
    const desktopIcon = document.createElement('div');
    desktopIcon.className = 'icon';

    const img = document.createElement('img');
    img.src = icon;
    img.alt = `Icon for ${title}`;
    img.className = 'desktop-icon-image';

    img.addEventListener('click', () => {
      this.addWindow({ title, icon, link });
    });

    const text = document.createElement('div');
    text.textContent = title;
    text.className = 'icon-text';

    desktopIcon.append(img, text);
    this.desktop.appendChild(desktopIcon);
  }

  // Add menu item
  addMenuItem({ title, link, icon }) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menuButton';
    menuItem.style.height = '40px';

    if (icon) {
      const img = document.createElement('img');
      img.src = icon;
      img.alt = `Icon for ${title}`;
      img.className = 'menuIcon';
      menuItem.appendChild(img);
    }

    const text = document.createElement('div');
    text.style.cssText = 'height:30px;line-height:30px;margin:5px;float:left;';
    text.innerHTML = `<b>${title}</b>`;
    menuItem.appendChild(text);

    menuItem.addEventListener('click', () => {
      this.addWindow({ title, icon, link });
    });

    this.menuContent.appendChild(menuItem);
  }
}

// Initialize WindowManager
const wm = new WindowManager();
window.wm = wm;

// Load menu and desktop and open all pages
document.addEventListener('DOMContentLoaded', () => {
  desktopIcons.forEach((element) => {
    // Add desktop icons
    wm.addDesktopIcon(element);
  });
  menuIcons.forEach((element) => {
    // Add desktop icons
    wm.addMenuItem(element);
    if (element.type == "sticky") {
      wm.addWindow(element);
    }
  });

  wm.positionTaskbar();
  if (!wm.isMobile) {
    document.getElementById('mainMenu').style.visibility = '';
  }
});
