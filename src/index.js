import './styles/styles.scss';

if (window.NodeList && !NodeList.prototype.forEach) { // Поддержка foreach в IE
  NodeList.prototype.forEach = Array.prototype.forEach;
}

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) { // Поддержка closest в IE
  Element.prototype.closest = function (s) {
    let el = this;

    do {
      if (Element.prototype.matches.call(el, s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}
import('./scripts/scripts.js');
