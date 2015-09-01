'use strict';

exports.__esModule = true;
exports['default'] = bindConnectorMethod;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsShallowEqual = require('./utils/shallowEqual');

var _utilsShallowEqual2 = _interopRequireDefault(_utilsShallowEqual);

var _utilsCloneWithRef = require('./utils/cloneWithRef');

var _utilsCloneWithRef2 = _interopRequireDefault(_utilsCloneWithRef);

var _disposables = require('disposables');

var _react = require('react');

function bindConnectorMethod(handlerId, connect) {
  var disposable = new _disposables.SerialDisposable();

  var currentNode = null;
  var currentOptions = null;

  function ref(nextWhatever, nextOptions) {
    // If passed a ReactElement, clone it and attach this function as a ref.
    // This helps us achieve a neat API where user doesn't even know that refs
    // are being used under the hood.
    if (_react.isValidElement(nextWhatever)) {
      var nextElement = nextWhatever;
      return _utilsCloneWithRef2['default'](nextElement, function (inst) {
        return ref(inst, nextOptions);
      });
    }

    // At this point we can only receive components or DOM nodes.
    var nextNode = _react.findDOMNode(nextWhatever);

    // If nothing changed, bail out of re-connecting the node to the backend.
    if (nextNode === currentNode && _utilsShallowEqual2['default'](currentOptions, nextOptions)) {
      return;
    }

    currentNode = nextNode;
    currentOptions = nextOptions;

    if (!nextNode) {
      disposable.setDisposable(null);
      return;
    }

    // Re-connect the node to the backend.
    var currentDispose = connect(handlerId, nextNode, nextOptions);
    disposable.setDisposable(new _disposables.Disposable(currentDispose));
  }

  return {
    ref: ref,
    disposable: disposable
  };
}

module.exports = exports['default'];