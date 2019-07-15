<template>
  <div>
    <!-- Nav Links -->
    <div ref="slider" class="navMenu" id="navMenuBox" :style="[menuDirection]">
      <a href="javascript:void(0)" class="closebtn">&times;</a>
      <a v-for="link in links" :key="link.id" :href="link.url">{{ link.text }}</a>
    </div>
    <!-- Hamburger Menu -->
    <nav ref="menuIcon" class="navIcon" @click="toggleMenu()" :style="iconDirection">
      <a href="javascript:void(0)" data-test-ref="navMenuLink">
        <svg width="30" height="30">
          <path d="M0,5 30,5" :stroke="styles['menu-icon-color']" stroke-width="5"/>
          <path d="M0,14 30,14" :stroke="styles['menu-icon-color']" stroke-width="5"/>
          <path d="M0,23 30,23" :stroke="styles['menu-icon-color']" stroke-width="5"/>
        </svg>
      </a>
    </nav>
  </div>
</template>

<script>
import styles from '@/assets/sass/variables.scss'
import utilities from '@/js/utilities'
export default {
  name: 'slider',
  props: {
    width: {
      type: Number,
      required: false,
      default: 250
    },
    format: {
      type: String,
      required: false,
      default: 'overlay'
    },
    direction: {
      type: String,
      required: false,
      default: 'left'
    },
    opacity: {
      type: Number,
      required: false,
      default: 0
    },
    links: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      styles: styles,
      menuWidth: {
        'width': 0
      }
    }
  },
  created() {
    console.log('styles', styles);
  },
  computed: {
    menuDirection () {
      return this.direction === 'right' ? { 'right': 0 } : { 'left': 0 }
    },
    iconDirection () {
      return this.direction === 'right' ? { 'float': 'right' } : { 'float': 'left' }
    },
    app () {
      return document.getElementById('app')
    },
    navMenuBox() {
      return document.getElementById('navMenuBox')
    }
  },
  methods: {
    openMenu () {
      if (this.opacity) {
        document.body.style.backgroundColor = utilities.hexToRGB(styles['background-color'], this.opacity)
      }
      this.setFormat()
    },
    setFormat () {
      const width = this.width.toString() + 'px'
      if (this.format === 'overlay') {
        // this.menuWidth = { 'width': width }
        this.navMenuBox.style.width = width
      } else if (this.format === 'full') {
        // this.menuWidth = { 'width': '100%' }
        this.navMenuBox.style.width = '100%'
      } else {
        this.navMenuBox.style.width = width
        if (this.app) {
          if (this.direction === 'right') {
            this.app.style.marginRight = width
            this.app.style.transition = 'margin-right 2.5s'
          } else {
            this.app.style.marginLeft = width
            this.app.style.transition = 'margin-left 2.5s'
          }
        } else {
          console.warn(`[Slider] The format was set to '${this.format}', but there is no element with an id 'app'. Add id='app' to the element to move.`)
        }
      }
    },
    closeMenu () {
      // this.menuWidth = { 'width': 0 }
      this.navMenuBox.style.width = '0px'
      if (this.app) {
        this.app.style.marginLeft = '0'
        this.app.style.marginRight = '0'
      }
      if (this.opacity) {
        document.body.style.backgroundColor = styles['background-color']
      }
    },
    toggleMenu () {
      console.log('aaaa');
      this.navMenuBox.classList.add('clicked')
      // console.log('this.navMenuBox.style.width', this.navMenuBox.style.width);
      // if (this.navMenuBox.style.width === '0px' || !this.navMenuBox.style.width) {
      //   this.openMenu()
      // } else {
      //   this.closeMenu()
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/sass/variables.scss';
  body {
    background-color: $background-color;
    // transition: background-color .5s;
  }
  #app {
    transition: margin-left .5s;
    transition: margin-right .5s;
    padding: 20px;
  }
  div.navMenu {
    font-family: $font-family-sans-serif;
    height: 100%;
    transition-property: width;
    transition-duration: 3s;
    width: 0;
    position: fixed;
    z-index: 1;
    top: 0;
    background-color: $menu-background;
    overflow-x: hidden;
    padding-top: 60px;
    transition: 0.5s;
    a {
      padding: 8px 8px 8px 32px;
      text-decoration: none;
      font-size: 25px;
      color: $menu-text;
      display: block;
      transition: 3.3s;
      &:hover {
        color: $menu-text-hover;
      }
    }
    .closebtn {
      position: absolute;
      top: 0;
      right: 25px;
      font-size: 36px;
      margin-left: 50px;
    }
  }
  .navMenu.clicked {
    transition-property: width;
    transition-duration: 3s;
    width: 300px;
  }
  @media screen and (max-height: 450px) {
    .navMenu {
      padding-top: 15px;
      a {
        font-size: 18px;
      }
    }
  }
</style>
