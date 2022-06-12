<template>
  <!-- 背包弹窗 -->
  <div class="knapsack-dialog">
    <el-dialog title="背包" :visible.sync="selfVisible" width="80%">
      <div class="container" v-if="!loading">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="鱼饵(BAITS)" name="0">
            <Baits></Baits>
          </el-tab-pane>
          <el-tab-pane label="工具(TOOLS)" name="1"></el-tab-pane>
          <el-tab-pane label="成员(PARTS)" name="2"></el-tab-pane>
          <el-tab-pane label="中止的工具(TOOLS SUSPEND)" name="3"> </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="selfVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { handleSubs } from '@/store/light';
import Baits from './Baits.vue';
export default {
  components: { Baits },
  name: 'KnapsackDialog',
  data() {
    return {
      activeName: '0',
      loading: false
    };
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
  watch: {
    selfVisible(val) {
      if (val) {
        this.refresh();
      }
    }
  },
  created() {
    handleSubs.push(this.refresh);
  },
  methods: {
    refresh() {
      this.loading = true;
      this.$nextTick(() => {
        this.loading = false;
      });
    },
    confirm() {}
  }
};
</script>
<style lang="scss" scoped></style>
