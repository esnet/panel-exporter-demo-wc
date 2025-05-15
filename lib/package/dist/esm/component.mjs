var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
class GrafanaPanelComponent extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue;
    this.render();
  }
  render() {
    if (!window.Grafana) {
      console.error("window.Grafana not found");
      return;
    }
    let style = `height:${parseInt(this.height)}px; width:${parseInt(this.width)}px;`;
    this.innerHTML = `<div class="grafana-panel-exporter" style="${style}"></div>`;
    let bindingPoint = this.querySelector(".grafana-panel-exporter");
    let doLoginRedirect = typeof this["login-redirect"] === "undefined" || this["login-redirect"] === true;
    window.Grafana.Context(this["dashboard-uid"], doLoginRedirect).then((appContext) => {
      window.Grafana.bindPanelToElement(
        appContext,
        this["dashboard-uid"],
        this["panel-id"],
        bindingPoint,
        parseInt(this.height),
        parseInt(this.width)
      );
    });
  }
}
__publicField(GrafanaPanelComponent, "observedAttributes", ["dashboard-uid", "panel-id", "height", "width", "login-redirect"]);
customElements.define("grafana-panel", GrafanaPanelComponent);

export { GrafanaPanelComponent };
//# sourceMappingURL=component.mjs.map
