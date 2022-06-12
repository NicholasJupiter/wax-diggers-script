<template>
  <div class="config-dialog">
    <el-dialog title="脚本配置" :visible.sync="selfVisible" width="80%">
      <el-form label-width="100px">
        <el-form-item label="使用鱼饵">
          <el-radio-group v-model="config.useBaitId">
            <el-radio :label="1000">
              <img src="@/assets/imgs/coin/FSLF.png" />蓝色（普通 FSLF）
            </el-radio>
            <el-radio :label="1001">
              <img src="@/assets/imgs/coin/FSLS.png" />蓝色（普通 FSLS）
            </el-radio>
            <el-radio :label="1002">
              <img src="@/assets/imgs/coin/FSLF.png" />绿色（稀有 FSLF）
            </el-radio>
            <el-radio :label="1003">
              <img src="@/assets/imgs/coin/FSLS.png" />绿色（稀有 FSLS）
            </el-radio>
          </el-radio-group>
          <el-input
            size="small"
            placeholder="每次使用数量"
            v-model="config.useBaitAmount"
          ></el-input>
        </el-form-item>

        <el-form-item label="购买鱼饵">
          <el-radio-group v-model="config.buyBaitId">
            <el-radio :label="bait.id" v-for="bait of BAITS_CONFIG" :key="bait.id">
              <img :src="bait.icon" />{{ bait.name }}
            </el-radio>
          </el-radio-group>
          <el-input size="small" placeholder="购买数量" v-model="config.buyBaitAmount"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="selfVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { gamesConfig } from '@/store/light';
import { BAITS_CONFIG } from '../config/constant';
export default {
  name: 'ConfigDialog',
  data() {
    return {
      config: { ...gamesConfig.fishing },
      BAITS_CONFIG
    };
  },
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.config = { ...gamesConfig.fishing };
      }
    }
  },
  computed: {
    selfVisible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  },
  created() {},
  methods: {
    confirm() {
      this.$mergeForm(gamesConfig.fishing, this.config);
      this.$message.success('保存成功！');
      this.selfVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.config-dialog {
  .el-radio {
    ::v-deep .el-radio__label {
      line-height: 2.4;
    }
    img {
      vertical-align: middle;
      width: 24px;
      margin-right: 4px;
    }
  }
}
</style>
