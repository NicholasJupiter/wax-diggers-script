import Vue from 'vue';

const Mixins = {
  methods: {
    $alcorHref(token, collectionName) {
      return `https://wax.alcor.exchange/trade/${token}-${collectionName}_wax-eosio.token`;
    }
  }
};

Vue.mixin(Mixins);
