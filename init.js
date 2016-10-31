'use strict';

const Electron = require('electron');

document.addEventListener('readystatechange', () => {
  if ( document.readyState !== 'complete' ) {
    return;
  }

  let frameEL = document.getElementById('frame');
  let selectEL = document.getElementById('select');
  let reloadEL = document.getElementById('reload');
  let profile = null;

  //
  window.requestAnimationFrame(() => {
    _resize();
  });

  // events

  // on window-resize
  window.addEventListener('resize', () => {
    _resize();
  });

  // on select-changed
  selectEL.addEventListener('confirm', event => {
    let path = event.target.value;

    profile.data.select = path;
    profile.save();

    _exec(path);
  });

  // on reload
  reloadEL.addEventListener('confirm', () => {
    _exec(selectEL.value);
  });

  //
  Electron.ipcRenderer.on('app:reload', (event, path) => {
    if ( path.indexOf(selectEL.value) === 0 ) {
      _exec(selectEL.value);
    }
  });

  // load profile
  Editor.Profile.load('profile://local/settings.json', (err, pf) => {
    profile = pf;

    selectEL.value = profile.data.select;
    _exec(selectEL.value);
  });

  function _exec ( path ) {
    _reset();

    frameEL.src = Editor.url(`app://${path}/index.html`);

    // clear caches
    Electron.webFrame.clearCache();
    // console.log(Electron.webFrame.getResourceUsage());
  }

  function _resize () {
    let canvasEL = document.querySelector('canvas');
    if ( canvasEL ) {
      let bcr = canvasEL.parentElement.getBoundingClientRect();
      canvasEL.width = bcr.width;
      canvasEL.height = bcr.height;
    }
  }

  function _reset () {
    console.clear();
    frameEL.src = '';
  }
});
