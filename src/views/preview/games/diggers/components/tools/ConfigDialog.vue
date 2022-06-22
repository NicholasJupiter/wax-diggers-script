<template>
  <div class="config-dialog">
    <el-dialog title="脚本配置" :visible.sync="selfVisible" width="80%">
      <el-form label-width="100px">
        <el-form-item label="维修方式">
          <el-radio-group v-model="config.tools_repirType">
            <el-radio :label="0">耐久度到0执行</el-radio>
            <el-radio :label="1">Mine之前执行</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="自动危险矿洞">
          <div>
            <el-checkbox-group v-model="config.tools_betType" :max="1">
              <el-checkbox :label="1" style="color: #e6a23c">危险挖矿</el-checkbox>
              <el-checkbox :label="2" style="color: #f56c6c">贼TM蛇皮危险的挖矿</el-checkbox>
            </el-checkbox-group>
          </div>

          <template v-if="config.tools_betType.length">
            <div>
              <el-checkbox-group v-model="config.tools_betEquip">
                <el-checkbox label="bomb">炸弹</el-checkbox>
                <el-checkbox label="pickaxe">镐</el-checkbox>
                <el-checkbox label="jackhammer">钻</el-checkbox>
              </el-checkbox-group>
            </div>

            <div>
              <el-checkbox-group v-model="config.tools_betRarity">
                <el-checkbox label="common">常见(白色)</el-checkbox>
                <el-checkbox label="rare">稀有(蓝色)</el-checkbox>
                <el-checkbox label="epic">史诗(紫色)</el-checkbox>
                <el-checkbox label="legendary">传说(橙色)</el-checkbox>
              </el-checkbox-group>
            </div></template
          >
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="selfVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirm">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { gamesConfig } from '@/store/light';
export default {
  name: 'ConfigDialog',
  data() {
    return {
      config: { ...gamesConfig.diggers }
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
        this.config = { ...gamesConfig.diggers };
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
      this.$mergeForm(gamesConfig.diggers, this.config);
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
