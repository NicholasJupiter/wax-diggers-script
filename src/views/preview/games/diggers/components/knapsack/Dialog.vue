<template>
  <div class="config-dialog">
    <el-dialog title="脚本配置" :visible.sync="selfVisible" width="80%">
      <Table></Table>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="selfVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Table from './Table';
export default {
  components: { Table },
  name: 'ConfigDialog',
  data() {
    return {};
  },
  props: {
    value: {
      type: Boolean,
      required: true
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
