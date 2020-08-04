<template>
  <div class="k-image">
    <img ref='img' :style="imageStyle" :src="src" @load="onImageEvent" @error="this.onImageEvent"></img>
  </div>  
</template>
<script>
export default {
  name: 'KImage',
  data(){
    return {
      src:""
    }
  },
  methods:{
    layout(){
      if( !this.src ) return;
      if( !this.naturalWidth ){
        if( this.image ){
          let width = 0,height=0;
          if( this.image.naturalWidth ){
            width = this.image.naturalWidth;
            height = this.image.naturalHeight;
          }else{
            if( this.image.width ){
              width = this.image.width;
              height = this.image.height;
            }
          }
          this.naturalWidth = width;
          this.naturalHeight = height;          
        }
      }
      if( !this.viewWidth ){
        this.viewWidth = this.naturalWidth;
      }
      if( !this.viewHeight ){
        this.viewHeight = this.naturalHeight;
      }
      let ratioView = this.viewWidth / this.viewHeight;
      let ratioNatural = this.naturalWidth / this.naturalHeight;
      let cropped_width = 0, cropped_height = 0;
      let mode = this.$attrs.mode;
      if( ratioNatural >ratioView ){
        if( mode == 'fill' ){
          cropped_width = this.viewWidth;
          cropped_height = this.viewWidth / ratioNatural;
        }else{
          cropped_height = this.viewHeight;
          cropped_width = this.viewHeight * ratioNatural;
        }
      }else if( ratioNatural < ratioView ){
        if( mode == 'fill'){
          cropped_height = this.viewHeight;
          cropped_width = this.viewHeight * ratioNatural;
        }else{
          cropped_width = this.viewWidth;
          cropped_height = this.viewWidth / ratioNatural;
        }
      }else{
        cropped_width = this.viewWidth;
        cropped_height = this.viewHeight;
      }
      this.imageWidth = cropped_width;
      this.imageHeight = cropped_height;
      this.opacity = 1;
      //console.log("viewWidth",this.viewWidth,'viewHeight',this.viewHeight, 'cropped_width', cropped_width, 'cropped_height', cropped_height)

    },
    onImageEvent:function( e ){
      console.log('on image event:', e)
    }
  },
  computed:{
    imageStyle:function(){
      if( this.imageWidth && this.imageHeight ){
        return {
          width: this.imageWidth, height: this.imageHeight
        }
      }
    }
  },
  mounted(){
    if( this.$attrs['src']){
      this.src = this.$attrs['src'];
    }
    this.image = this.$refs.img;
    this.layout();
  },
}
</script>