<template>
  <div>
    <!-- 轮播图 -->
    <div class="banner">
      <div class="bg" ref="bg">
        <transition-group tag="div" name="fade">
          <div v-for="(item, i) in bannerList" v-show="i===mark" :key="item.id" style="position:absolute"
               @click="linkTo(item.goodsId)" @mouseover="stopTimer" @mouseout="startTimer">
            <img :src="item.url"/>
          </div>
        </transition-group>
      </div>
      <div class="page">
        <ul class="dots">
          <li class="dot-active" v-for="(item, i) in bannerList" :class="{ 'dot':i!=mark }" :key="i"
              @click="change(i)"></li>
        </ul>
      </div>
    </div>
    <div class="activity-panel">
      <!-- 仅仅要活动版块的内容 -->
      <el-row type="flex" justify="space-between">
        <el-col class="content" :span="6" v-for="promotion in promotionList" :key="promotion.id">
          <el-card :body-style="{ padding: '0px' }" @click.native="linkTo(promotion.id)">
            <img v-lazy="promotion.mainImage">
            <a href="javascript:void(0)" class="cover-link"></a>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <section class="w clearfix">
      <cry-shelf title="热门商品">
        <div slot="content" class="hot">
          <cry-goods v-for="item in hotGoodsList" :key="item.id" :goods="item"></cry-goods>
        </div>
      </cry-shelf>
    </section>
    <div v-for="(item,index) in homeList" :key="index">

      <!-- 商品title -->
      <!--      <section class="w mt30 clearfix" v-if="item.type===2">-->
      <!--        <m-shelf :title="item.name">-->
      <!--          <div slot="content" class="hot">-->
      <!--            <mall-goods v-for="(o,i) in item.panelContents" :key="i" :goods="o"></mall-goods>-->
      <!--          </div>-->
      <!--        </m-shelf>-->
      <!--      </section>-->
      <!--      <section class="w mt30 clearfix" v-if="item.type===3">-->
      <!--        <m-shelf :title="item.name">-->
      <!--          <div slot="content" class="floors">-->
      <!--            <div-->
      <!--                class="imgbanner"-->
      <!--                v-for="(o,j) in item.panelContents"-->
      <!--                :key="j"-->
      <!--                v-if="o.type===2 || o.type===3"-->
      <!--            >-->
      <!--              <img :src="o.picUrl" alt="">-->
      <!--            </div>-->
      <!--            <mall-goods :goods='o' v-for='(o,i) in item.panelContents' :key='i' v-if='o.type===0'></mall-goods>-->
      <!--          </div>-->
      <!--        </m-shelf>-->
      <!--      </section>-->
    </div>
  </div>
</template>

<script>
import CryShelf from '@/components/CryShelf';
import CryGoods from '@/components/CryGoods';
// 主要逻辑
export default {
  data () {
    return {
      bannerList: [],
      homeList: [],
      promotionList: [],
      hotGoodsList: [],
      mark: 0
    };
  },
  components: {
    CryShelf,
    CryGoods
  },
  async created () {
    this.getBannerList();
    this.getPlateInfoList();
  },
  methods: {
    async getBannerList () {
      const [err, res] = await this.$http.asyncGet('api/v1.0/getBannerList', {
        orderField: 'priority',
        sort: 'asc',
        start: 1
      });
      if (!err && res) {
        if (res.data.success) {
          this.bannerList = res.data.data.bannerList;
          this.play();
        } else {
          this.$vmessage.error(res.data.msg);
        }
      }
    },
    async getPlateInfoList () {
      const [err, res] = await this.$http.asyncGet('api/v1.0/getPlateInfoList');
      if (!err && res) {
        if (res.data.success) {
          const plateInfoList = res.data.data.plateInfoList;
          for (const item of plateInfoList) {
            switch (item.type) {
              case 0:
                this.promotionList = item.goodsList;
                break;
              case 1:
                this.hotGoodsList = item.goodsList;
                break;
              case 2:
                break;
            }
          }
        } else {
          this.$vmessage.error(res.data.msg);
        }
      }
    },
    autoPlay () {
      this.mark++;
      if (this.mark > this.bannerList.length - 1) {
        // 当遍历到最后一张图片置零
        this.mark = 0;
      }
    },
    play () {
      // 每2.5s自动切换
      this.timer = setInterval(this.autoPlay, 4000);
    },
    change (i) {
      this.mark = i;
      clearInterval(this.timer);
      this.timer = setInterval(this.autoPlay, 4000);
    },
    startTimer () {
      this.timer = setInterval(this.autoPlay, 4000);
    },
    stopTimer () {
      clearInterval(this.timer);
    },
    linkTo (id) {
      const { href } = this.$router.resolve({
        name: 'goodsdetail',
        query: { id: id }
      });
      window.open(href, '_blank');
    }
  }

};
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/theme.scss";

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .banner {
    position: relative;
    z-index: 19;
    margin: 0 auto;
    width: 1220px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 10px;
    }
  }

  .bg {
    cursor: pointer;
    position: relative;
    width: 1220px;
    height: 470px;
    background-size: 100% 100%;
    border-radius: 10px;
    box-shadow: 5px 5px 20px $color-shadow, -5px -5px 20px $color-white;

    & div {
      position: relative;
      height: 100%;
      width: 100%;
    }
  }

  .page {
    width: 100%;
    margin-top: 15px;

    .dots {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      .dot-active {
        display: inline-block;
        width: 15px;
        height: 15px;
        box-shadow: inset 2px 2px 2px $color-shadow, inset -2px -2px 2px $color-white;
        border-radius: 8px;
        margin-right: 15px;
        cursor: pointer;
        transition: all 0.2s ease-out;
      }

      .dot.dot-active {
        width: 16px;
        height: 16px;
        border-radius: 10px;
        box-shadow: 2px 2px 2px $color-shadow, -2px -2px 2px $color-white;
        transition: all 0.2s ease-out;
      }
    }
  }

  .el-card {
    border: none;
    border-radius: unset;
    box-shadow: none;
  }

  .activity-panel {
    width: 1220px;
    margin: 20px auto;

    .el-card {
      border-right: 1px solid #d6d6d6;
      cursor: pointer;

      &:hover {
        box-shadow: inset 1px 1px 10px $color-shadow
      }
    }

    img {
      width: 100%;
      display: block;
    }
  }

  .content {
    position: relative;
    height: 164px;

    ::v-deep .el-card__body, .el-card, img {
      height: 100%;
    }

  }

  .cover-link {
    cursor: pointer;
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 4;

    &:hover {
      box-shadow: inset 0 0 38px rgba(0, 0, 0, .08);
      transition: all .15s ease;
    }
  }

  .hot {
    display: flex;

    & > div {
      flex: 1;
    }
  }
</style>
