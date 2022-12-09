<script>
export default {
  data() {
    return {
      isShowArrayBlock: false,
      count: 1,
    }
  },

  mounted() {
    this.count = 2
  },

  methods: {
    toggleArrayBlock () {
    	this.isShowArrayBlock = !this.isShowArrayBlock;
    },
    increaseCount () {
      this.count++;
    },
    dicreaseCount () {
      this.count--;
    }
  },

  computed: {
  	createdArrayByCount () {
      const res = [];

      for (let i = 0; i<Math.abs(this.count); ++i) {
        const value = Math.random();

        const itemToSave = {
          value: this.count > 0 ? value :  -value,
          text: `index of item is: ${this.count > 0 ? "" :  "-"}${i}`
        };

      	res.push(itemToSave);
      }

      return res;
    }
  }
}
</script>

<style>
  .block {
    display: flex;
  }

  .wrapper {
		border: 1px solid red;
    padding: 10px;


  }

  .wrapper__inner {
      border: 1px solid blue;
  }

  .wrapper__actions {}

  .wrapper__toggle-array-by-count {}

  .wrapper__increaseCount {}

  .wrapper__dicreaseCount {}

  .wrapper__array-by-count {}
</style>

<template>
  <div v-bind:class="'wrapper'">
    <div v-bind:class="'wrapper__inner'">
      <div v-bind:class="'wrapper__content'">
        Count is: {{ count }}
      </div>

      <div v-bind:class="'wrapper__actions'">
        <div v-bind:class="'block'">
          <div v-bind:class="'wrapper__toggle-array-by-count'">
            <button v-on:click="toggleArrayBlock">Toggle array block</button>
          </div>
        </div>
        <div v-bind:class="'block'">
          <div v-bind:class="'wrapper__increaseCount'">
            <button v-on:click.shift.exact="increaseCount">Click to increase count</button>
          </div>
          <div v-bind:class="'wrapper__dicreaseCount'">
            <button v-on:click.enter.exact="dicreaseCount">Click to dicrease count</button>
          </div>
        </div>
      </div>

      <div v-bind:class="'wrapper__array-by-count'" v-if="isShowArrayBlock">
        <ul>
          <li v-for="item in createdArrayByCount">
            <p>
            	{{item.value}}
            </p>
            <p>
            	{{item.text}}
            </p>
          </li>
        </ul>
      </div>
      <div v-bind:class="'wrapper__array-by-count'" v-else>
        Array by count is removed from V-DOM
      </div>

      <input
        type="radio"
        v-model="isShowArrayBlock"
        true-value="false"
        false-value="true" />
    </div>
  </div>


</template>
