<template>
  <div class="preview">
    <div class="empty-account" v-if="!obser.owner">账号为空</div>
    <template v-else>
      <div class="preview-header">
        <div class="left">
          <span class="game-name"> {{ GAME_NAME[obser.gamename] }} </span>
          <span class="wax-name" @click="copyName">{{ obser.owner }}</span>
        </div>
      </div>
      <div class="game-container">
        <component :is="obser.gamename"></component>
      </div>
    </template>
  </div>
</template>
<script>
import { gamesConfig, obser } from '@/store/light';
import Diggers from './games/diggers/index.vue';
import Fishing from './games/fish/index.vue';
import { GAME_NAME } from '@/utils/constant';

if (process.env.NODE_ENV === 'development') {
  require('@s/main');
}

export default {
  components: {
    diggerswgame: Diggers,
    fishinglgame: Fishing
  },
  data() {
    return {
      obser,
      GAME_NAME,
      gamesConfig
    };
  },
  computed: {
    waxname() {
      if (this.obser.owner) {
        return `${GAME_NAME[this.obser.gamename]}: [ ${this.obser.owner} ]`;
      }
      return '';
    }
  },

  watch: {
    gamesConfig: {
      handler(config) {
        console.log('update config', config);
        localStorage.setItem('gamesConfig', JSON.stringify(config));
      },
      deep: true
    }
  },
  created() {
    if (!localStorage.getItem('gamesConfig')) {
      localStorage.setItem('gamesConfig', JSON.stringify(gamesConfig));
    } else {
      const config = JSON.parse(localStorage.getItem('gamesConfig'));
      Object.keys(gamesConfig).forEach((key) => {
        this.$mergeForm(gamesConfig[key], config[key]);
      });
    }
    Object.entries(this.$route.query).forEach(([key, val]) => {
      key && (this.obser[key] = val);
    });
    this.obser.owner = this.$route.query.waxname;
    if (!this.obser.owner) {
      location.href += '?waxname=j4vym.wam&gamename=diggerswgame&collection_name=diggersworld';

      // location.href += '?waxname=j4vym.wam&gamename=fishinglgame&collection_name=fishinglands';
      location.reload();
      return;
    }
  },
  methods: {
    // 复制名称
    copyName() {
      if (this.obser.owner) {
        const input = document.createElement('textarea');
        document.body.appendChild(input);
        input.value = this.obser.owner;
        input.select();
        document.execCommand('copy', true);
        document.body.removeChild(input);
        this.$message.success('复制名称成功');
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.preview {
  padding: 16px;
  max-width: 900px;
  margin: 0 auto;
  .empty-account {
    text-align: center;
    font-size: 30px;
  }
  .preview-header {
    display: flex;
    align-items: center;
    .left {
      span {
        font-size: 24px;
        &.wax-name {
          cursor: pointer;
          color: #409eff;
          font-size: 20px;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
  .game-container {
    padding: 12px;
  }
}
</style>
