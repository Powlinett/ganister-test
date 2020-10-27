<template>
  <div>
    <h2>Let's configure your product!</h2>
    <form id="configureBOM">
      <div v-for="(component, index) in components" :key="component" class="component-options">
        <div v-if="component.option" class="component-input option-input">
          <input type="checkbox" v-bind:id="component.id"
                                  v-bind:value="component.id"
                                  v-model="idsSelection"
                                  v-on:change="updateBOM()"
                                  v-bind:disabled="component.forbidden">
          <label v-bind:for="component.id"> {{ component.name }} </label>
        </div>
        <div v-if="component.variants && index === 0">
          <div v-for="variant in component.variants" :key="variant" class="component-input">
            <input type="radio" v-bind:id="variant.id"
                                v-bind:value="variant.id"
                                v-model="idsSelection[index]"
                                v-on:change="updateBOM()">
            <label v-bind:for="variant.id"> {{ variant.name }} </label>
          </div>
        </div>
        <div v-else-if="component.variants">
          <div v-for="variant in component.variants" :key="variant" class="component-input">
            <input type="radio" v-bind:id="variant.id"
                                v-bind:value="variant.id"
                                v-model="idsSelection[index]"
                                v-on:change="updateBOM()"
                                v-bind:disabled="variant.forbidden"
                                v-bind:checked="checkLastAvailableVariant(component.variants, variant)">
            <label v-bind:for="variant.id"> {{ variant.name }} </label>
          </div>
        </div>
      </div>
      <button v-on:click="mounted()">Restart Config</button>
    </form>
    <div id="configuredBOM">
      {{ idsSelection }}
      <h3>Final BOM:</h3>
      {{ bom }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data () {
    return {
      components: [],
      idsSelection: [],
      bom: {}
    }
  },

  mounted () {
    axios.post(
      'http://localhost:3000/getConfiguredBOM',
      { parts: [] }
    )
    .then((response) => {
      const components = response.data.components;
      const flattenComponents = []
      this.components = this.FlatComponentsArray(components, flattenComponents);
    })
  },

  methods: {
    FlatComponentsArray(components, flattenArray) {
      components.forEach((component) => {
        if (component.components) {
          this.FlatComponentsArray(component.components, flattenArray)
        } else if (component.variants || component.option) {
          flattenArray.push(component);
        }
      })
      return flattenArray;
    },

    removeNullIds(ids) {
      return ids.filter((id) => {
        return id !== null
      })
    },

    updateBOM() {
      const ids = this.removeNullIds(this.idsSelection);
      axios.post(
        'http://localhost:3000/getConfiguredBOM',
        { parts: ids }
      )
      .then((response) => {
        this.bom = response.data;
        const bomComponents = this.bom.components;
        this.updateForm(this.components, bomComponents);
      })
    },

    updateForm(components, bomComponents) {
      let bomIds = []
      this.getIdsFromComponents(bomComponents, bomIds);
      this.setForbbidenProperty(components, bomIds);
      bomIds = [];
      return components;
    },

    getIdsFromComponents(components, idsArray) {
      components.forEach((component) => {
        const nestedComponents = component.components || component.variants;
        if (nestedComponents) {
          this.getIdsFromComponents(nestedComponents, idsArray);
        } else {
          idsArray.push(component.id);
        }
      })
      return idsArray;
    },

    setForbbidenProperty(components, bomIds) {
      components.forEach((component) => {
        const nestedComponents = component.components || component.variants;
        if (nestedComponents) {
          this.setForbbidenProperty(nestedComponents, bomIds)
        } else {
          if (bomIds.includes(component.id) || component.option) {
            component.forbidden = false;
          } else {
            component.forbidden = true;
          }
        }
      })
      return components;
    },

    checkLastAvailableVariant(variants, variant) {
      const hasForbbidenVariants = variants.some((v) => {
        return v.forbidden === true;
      })

      if (hasForbbidenVariants) {
        const availableVariants = variants.filter((v) => {
          return (v.forbidden === false && v.id === variant.id)
        });
        return availableVariants.length === 1 ? true : false;
      }
    }
  },

  name: 'Form'
}
</script>
