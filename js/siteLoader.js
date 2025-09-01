// TODO: Clean up Code!

var screen_dimension = [
  window.innerWidth || document.documentElement.clientHeight || document.body.clientWidth,
  window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
];

// ------ Methods for the window divs ------

// Adds a new window with a innerHtml to the document
// TODO: Change Parameters
function addWindow(title, icon, innerHtml, w, h, left, top) {
  // Create a random ID
  var window_id = Math.floor(Math.random() * 1000000 + 1000);
  // Create the window div and add attributes
  var new_window = document.createElement('div');
  new_window.setAttribute('class', 'window glass active');
  new_window.setAttribute('id', window_id);
  new_window.style =
    'position: absolute; width: ' +
    w +
    'px; height: ' +
    (h + 35) +
    'px; left: ' +
    left +
    'px; top: ' +
    top +
    'px';

  // Create the title bar of the window
  var title_bar = document.createElement('div');
  title_bar.setAttribute('class', 'title-bar');

  // Create the text of the tile bar and add it to the title bar itself
  var title_bar_text = document.createElement('div');
  title_bar_text.setAttribute('class', 'title-bar-text');
  title_bar_text.innerHTML =
    '<img alt="" src="' + icon + '" style="height: 11px; margin-right: 5px; float:left;">';
  title_bar_text.innerHTML += title;
  title_bar.appendChild(title_bar_text);

  // Create the icons for the title bar and add them
  var title_bar_item = document.createElement('div');
  title_bar_item.setAttribute('class', 'title-bar-controls');
  title_bar_item.innerHTML =
    '<button aria-label="Minimize" onClick="toggleWindow(' + window_id + ')"></button>';
  title_bar_item.innerHTML +=
    '<button id="btn-resize-' +
    window_id +
    '" aria-label="Maximize" onClick="resizeWindow(' +
    window_id +
    ')"></button>';
  title_bar_item.innerHTML +=
    '<button aria-label="Close" onClick="removeWindow(' + window_id + ')"></button>';
  title_bar.appendChild(title_bar_item);

  // Add the title bar to the window
  new_window.appendChild(title_bar);

  // Create the content of the window
  var window_content = document.createElement('div');
  window_content.setAttribute('class', 'window-body');
  window_content.style = 'position: relative; height: ' + h + 'px; overflow: hidden;';
  window_content.innerHTML = innerHtml;
  new_window.appendChild(window_content);

  // Add the listeners for dragging the window
  addMoveListeners(new_window, title_bar);

  // Append the window to the DOM
  document.body.appendChild(new_window);

  // Add the taskbar item
  var taskbar_item = document.createElement('button');
  taskbar_item.setAttribute('id', window_id + 't');
  taskbar_item.setAttribute('class', 'taskElement active');
  taskbar_item.setAttribute('style', 'white-space:nowrap; overflow: hidden;');
  taskbar_item.setAttribute('onClick', 'toggleWindow(' + window_id + ')');
  taskbar_item.innerHTML = '<img alt="" src="' + icon + '" class="taskElementImg">';
  document.getElementById('taskbar').appendChild(taskbar_item);

  return window_id;
}

// Creates the inner html for a Window and calls addWindow()
function fillWindow(title, link, icon, windowSize = [816, 480], windowBorder) {
  var width;
  var left;
  var top;

  if (typeof windowBorder === 'undefined') {
    left = Math.floor(Math.random() * (document.body.clientWidth - windowSize[0]));
    top = Math.floor(Math.random() * (screen_dimension[1] - windowSize[1] - 50));
  } else {
    left = windowBorder[0];
    top = windowBorder[1];

    windowSize[0] = document.body.clientWidth - left - windowBorder[2];
    windowSize[1] = screen_dimension[1] - top - windowBorder[3] - 50;
  }

  // Avoid windows that are larger than the screen (e.g. for mobile devices)
  if (windowSize[0] > screen_dimension[0]) {
    windowSize[0] = screen_dimension[0];
    windowSize[1] = screen_dimension[1];
    left = 0;
    top = 0;
  }

  let innerHTML =
    '<iframe class="window-content" width="' +
    (windowSize[0] - 16) +
    'px" height="' +
    (windowSize[1] - 30) +
    'px" type="text/html" src="' +
    link +
    '" frameborder="0" allowfullscreen onmouseover = "mouseMove(\'event\')"></iframe>';

  return addWindow(title, icon, innerHTML, windowSize[0], windowSize[1], left, top);
}

// Maximize/float a window with a certain window id
function resizeWindow(window_id) {
  var window_div = document.getElementById(window_id);
  var resize_button = document.getElementById('btn-resize-' + window_id);

  w = '100%';
  h = '100%';

  if (window_div.style.width == '100%') {
    w = '816px';
    h = '480px';
    resize_button.ariaLabel = 'Maximize';
  } else {
    window_div.style.top = '0';
    window_div.style.left = '0';
    resize_button.ariaLabel = 'Restore';
  }

  window_div.style.width = w;
  window_div.style.height = h;

  window_div.getElementsByClassName('window-content')[0].width = window_div.clientWidth - 16;
  window_div.getElementsByClassName('window-content')[0].height = window_div.clientHeight - 35;
  window_div.getElementsByClassName('window-body')[0].style.height =
    window_div.clientHeight - 35 + 'px';
}

// Removes a window with a specific ID (close button)
function removeWindow(id) {
  document.body.removeChild(document.getElementById(id));
  document.getElementById('taskbar').removeChild(document.getElementById(id + 't'));
}

// Minimizes/re-opens a window with a specific ID
function toggleWindow(id) {
  var window_div = document.getElementById(id);
  var taskbar_button = document.getElementById(id + 't');

  if (window_div.style.visibility == 'hidden') {
    window_div.style.visibility = '';
    taskbar_button.classList.add('active');
    focus_window(window_div);
  } else {
    window_div.style.visibility = 'hidden';
    taskbar_button.classList.remove('active');
  }
}

/////////////////////////////////////////
// Functions for the bulding and manipulating the menu and the taskbar

// Builds the menu
function build_menu() {
  var menu_div = document.getElementById('menu_content');

  menu_div.innerHTML = '';

  positionTaskbar();
}

// Position the taskbar on the bottom
function positionTaskbar() {
  document.getElementById('taskbar').style.marginTop = screen_dimension[1] - 50 + 'px';

  var menuHeight = document.getElementById('mainMenu').offsetHeight;
  document.getElementById('mainMenu').style.marginTop =
    screen_dimension[1] - 50 - menuHeight + 'px';
}

// Toggles the visibility of the menu
function toggleMenu() {
  var menu_div = document.getElementById('mainMenu');
  var menu_button = document.getElementById('taskMenBtn');

  if (menu_div.style.visibility == 'hidden') {
    menu_div.style.visibility = '';
    menu_button.classList.add('active');
  } else {
    menu_div.style.visibility = 'hidden';
    menu_button.classList.remove('active');
  }
}

/////////////////////////////////////////
// Functions for adding links to the page

// Creates a desktop icon
function add_desktop_item(itemTitle, itemContent, itemImage) {
  // Create the div containing the icon
  var desktop_icon = document.createElement('div');
  desktop_icon.setAttribute('class', 'icon');

  // Add the icon image
  var desktop_icon_img = document.createElement('img');
  desktop_icon_img.src = itemImage;
  desktop_icon_img.alt = 'Icon for menu item ' + itemTitle;
  desktop_icon_img.className = 'desktop-icon-image';
  desktop_icon_img.setAttribute(
    'onClick',
    'fillWindow("' + itemTitle + '","' + itemContent + '","' + itemImage + '");',
  );
  desktop_icon.appendChild(desktop_icon_img);

  // Add the icon Text
  desktop_icon.innerHTML += itemTitle;

  // Add the icon to the document
  document.body.appendChild(desktop_icon);
}

// Function to add a menu point entry to the menu
function add_menu_item(itemTitle, itemContent, itemImage) {
  let menu_item = document.createElement('div');
  menu_item.style.height = '40px';
  // Add Icon
  if (itemImage != '')
    menu_item.innerHTML =
      '<img alt="Icon for menu item ' + itemTitle + '" src="' + itemImage + '" class="menuIcon">';
  // Add Text
  menu_item.innerHTML +=
    '<div style="height: 30px;line-height: 30px;margin: 5px;float:left;"><b>' +
    itemTitle +
    '</b></div>';
  menu_item.className = 'menuButton';
  document.getElementById('menu_content').appendChild(menu_item);

  menu_item.setAttribute(
    'onClick',
    'fillWindow("' + itemTitle + '","' + itemContent + '","' + itemImage + '");',
  );
}

// Adds a helper link to the menu. The link reloads the whole site and is used for pagination
function add_menu_link(itemTitle, itemContent, itemImage) {
  let menu_item = document.createElement('div');
  menu_item.style.height = '30px';
  // Add Icon
  if (itemImage != '')
    menu_item.innerHTML =
      '<img alt="Icon for menu item ' +
      itemTitle +
      '" src="' +
      itemImage +
      '" style="width: 20px; margin: 5px; float:left;">';
  // Add Text
  menu_item.innerHTML +=
    '<div style="height: 20px;line-height: 20px;margin: 5px;float:left;"><b>' +
    itemTitle +
    '</b></div>';
  menu_item.className = 'menuButton';
  let linkElement = document.createElement('a');
  linkElement.href = itemContent;
  linkElement.appendChild(menu_item);

  document.getElementById('menu_content').appendChild(linkElement);
}

build_menu();
