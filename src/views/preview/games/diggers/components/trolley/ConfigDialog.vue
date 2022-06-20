<template>
  <div class="trolley-config-dialog">
    <el-dialog title="推车配置" :visible="value" width="80%" :before-close="beforeClose">
      <el-form label-width="200">
        <el-form-item label="时长">
          <span>长期(5天)</span>
          <el-switch v-model="config.trolley_isShort" style="margin: 0 8px"></el-switch>
          <span>短期(2天)</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="beforeClose">取 消</el-button>
        <el-button type="primary" size="small" @click="save">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { gamesConfig } from '@/store/light';
export default {
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
  created() {},
  methods: {
    beforeClose() {
      this.$emit('input', false);
    },
    save() {
      Object.assign(gamesConfig.diggers, this.config);
      this.beforeClose();
    }
  }
};
</script>
<style lang="scss" scoped>
// .trolley-config-dialog {
// }
</style>
