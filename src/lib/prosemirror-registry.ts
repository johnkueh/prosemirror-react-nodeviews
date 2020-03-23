const registry: {
  components: {
    [key: string]: React.FC;
  };
} = {
  components: {}
};

export function registerComponent(key: string, component: React.FC) {
  registry.components[key] = component;
}

export function getComponent(key: string) {
  return registry.components[key];
}
