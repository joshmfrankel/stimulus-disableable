import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['disableable', 'required'];

  connect() {
    const groupedRequiredTargets = {};
    this.requiredTargets.forEach((element) => {
      if (groupedRequiredTargets[element.name] === undefined) {
        groupedRequiredTargets[element.name] = {
          collection: [],
          type: element.type || element.nodeName,
          valid: false,
        };
      }
      groupedRequiredTargets[element.name].collection.push(element);
    });

    // Set class level variable
    this.groupedRequiredTargets = groupedRequiredTargets;

    this.validate();
  }

  validate() {
    Object.keys(this.groupedRequiredTargets).forEach((key) => {
      if (this.groupedRequiredTargets[key].type === 'checkbox') {
        this.groupedRequiredTargets[key].valid = this
          .groupedRequiredTargets[key]
          .collection
          .some((item) => item.checked);
      } else if (this.groupedRequiredTargets[key].type === 'text'
        || this.groupedRequiredTargets[key].type === 'textarea'
        || this.groupedRequiredTargets[key].type === 'TRIX-EDITOR') {
        this.groupedRequiredTargets[key].valid = this
          .groupedRequiredTargets[key]
          .collection[0]
          .value
          .trim() !== '';
      }
    });

    this.#setDisableableStatus();
  }

  /**
   * @private
   */
  #setDisableableStatus() {
    const enabled = Object
      .keys(this.groupedRequiredTargets)
      .map((key) => this.groupedRequiredTargets[key].valid)
      .every((item) => item === true);

    if (enabled === true) {
      this.disableableTarget.disabled = false;
    } else {
      this.disableableTarget.disabled = true;
    }
  }
}
