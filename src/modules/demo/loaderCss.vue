<template>
  <div class="loader">
    <span v-for="(item, index) in list" :key="index"></span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
$list: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9;
body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #9c27b0;
}
.loader {
  position: relative;
  width: 300px;
  height: 300px;
  transform-style: preserve-3d;
  transform: perspective(500px) rotateX(60deg);
}
.loader span {
  position: absolute;
  display: block;
  border: 5px solid #fff;
  box-shadow:
    0 5px 0 #ccc,
    inset 0 5px 0 #ccc;
  box-sizing: border-box;
  border-radius: 50%;
  animation: animate 3s ease-in-out infinite;
}
@keyframes animate {
  0%,
  100% {
    transform: translateZ(-100px);
  }
  50% {
    transform: translateZ(100px);
  }
}
// 循环list
.loader {
  @each $i in $list {
    span:nth-child(#{$i}) {
      top: (10 * $i) + px;
      left: (10 * $i) + px;
      bottom: (10 * $i) + px;
      right: (10 * $i) + px;
      animation-delay: 1.4s - ($i / 10);
    }
  }
}
</style>
