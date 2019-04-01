<template>
  <div class="index-banklist">
    <topBar>{{'银行卡列表'}}</topBar>
    <div class="tabbar">
      <div class="tabbar-item" :class="{active:payTypeCode==0}" @click="changePayTypeCode(0)">储蓄卡</div>
      <div class="tabbar-item" :class="{active:payTypeCode==1}" @click="changePayTypeCode(1)">信用卡</div>
    </div>
    <!-- <div class="search-box">
      <input
        type="search"
        v-model="keys"
        class="search-input"
        placeholder="请输入想搜索的内容"
        @keypress="keySearch"
      >
      <button @click="search(keys)" class="search-button">test</button>
    </div> -->

    <div class="list-box">
      <template v-for="(item,index) in datalist">
        <div
          :id="item.bankFirstLetter"
          class="char"
          :key="index+item.bankFirstLetter"
          v-if="showChar(index)"
        >{{item.bankFirstLetter}}</div>
        <div class="bank-item" :key="index+item.payChannelName">
          <div class="box-border">
            <div class="content">
              <div class="bank-name">
                <div class="icon-bank">
                  <img v-lazy="item.logoUrl" alt>
                </div>
                <p class="bank-name-detail">{{item.payChannelName}}</p>
              </div>
              <div class="limit" v-if="judgeLimit(item)">
                <span class="limit-text">{{item.onceLimit}}元/笔，</span>
                <span class="limit-text">{{item.dayLimit}}元/日</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="sidebar">
      <span class="sidebar-item" @click="scroll(item)" v-for="item in charArr" :key="item">{{item}}</span>
    </div>
  </div>
</template>
<script>
import pinyin from "chinese-to-pinyin";
import api from '~/api/api'
export default {
  data() {
    return {
      keys: "",
      payTypeCode: 0,
      charArr: [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      ],
      datalist1: [],
      ///
      datalist: [],
      /////
      saveCardList: [],
      creditCardList: []
    };
  },
  activated() {
    this.getListData(this.payTypeCode);
  },
  created() {
  },
  mounted() {},
  methods: {
    keySearch(e) {
      if (e.keyCode == 13) {
        this.search(this.keys);
      }
    },
    search(keys) {
      if (this.payTypeCode == 0) {
        this.datalist = this.saveCardList;
      } else {
        this.datalist = this.creditCardList;
      }
      var searchResArr = [];
      searchResArr = this.datalist.filter(item => {
        return item.payChannelName.indexOf(keys) > -1;
      });

      this.datalist = searchResArr;
    },
    changePayTypeCode(val) {
      this.payTypeCode = val;
      if (
        (this.payTypeCode == 0 && this.saveCardList.length == 0) ||
        (this.payTypeCode == 1 && this.creditCardList.length == 0)
      ) {
        this.getListData();
      } else {
        if (this.payTypeCode == 0) {
          this.datalist = this.saveCardList;
        } else {
          this.datalist = this.creditCardList;
        }
      }
    },
    scroll(char) {
      var id = char.toUpperCase();
      var firstLetterNode = document.getElementById(id);
      if (firstLetterNode) {
        document.getElementById(id).scrollIntoView({
          behavior: "auto",
          block: "start",
          inline: "nearest"
        });
      }
    },
    showChar(index) {
      if (index == 0) {
        return true;
      } else {
        if (
          this.datalist[index - 1].bankFirstLetter !=
          this.datalist[index].bankFirstLetter
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
    getListData() {
      this.$pageLoadingBox.show();
      api.getListData().then(res=>{
          var _this = this;
          this.$pageLoadingBox.hide();
          if (res.data.responseCode == "0000") {
            this.datalist = this.initList(res.data.cardList);
            if (this.payTypeCode == 0) {
              this.saveCardList = this.datalist;
            } else {
              this.creditCardList = this.datalist;
            }
          } else {
            this.$toastAlertBox.show({
              type: "alertBox",
              msg: res.data.responseMsg || "系统异常，请稍后再试",
              confirmBtn: "确认",
              closeCallback: function() {},
              confirmCallback: function() {
                _this.$router.go(-1);
              }
            });
          }
      }).catch(err=>{
          this.$pageLoadingBox.hide();
          this.$toastAlertBox.show({
            type: "toast",
            msg: err || "网络繁忙，请稍后再试"
          });
      })
    },
    initList(arr) {
      if (arr.length > 0) {
        arr.forEach(item => {
          if (!item.bankFirstLetter) {
            if (item.payChannelName) {
              var bigFirstletter = pinyin(item.payChannelName)
                .charAt(0)
                .toUpperCase();
              item.bankFirstLetter = bigFirstletter;
            }
          }
        });
        arr.sort((a, b) => {
          if (a.bankFirstLetter > b.bankFirstLetter) {
            return 1;
          } else if (a.bankFirstLetter == b.bankFirstLetter) {
            return 0;
          } else {
            return -1;
          }
        });
      }
      return arr;
    },
    judgeLimit(item) {
      if (item.dayLimit) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
// @import "../../../scss/_reset.scss";
.search-box {
  display: flex;
  width: 3.43rem;
  margin: 0 auto;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 4px 8px 0 rgba(7, 17, 27, 0.1);
  position: relative;
  margin-bottom: 0.12rem;
  overflow: hidden;
}
.search-button {
  width: 0.53rem;
  height: 0.3rem;
  display: inline-block;
  padding: 0;
  margin: 0;
  border: none;
  background-color: #f01414;
  color: #fff;
  font-size: 0.13rem;
}
.search-input {
  flex: 1 1 auto;
  display: inline-block;
  border: none;
  background-color: rgba(255, 255, 255, 0.9);
  font-size: 0.16rem;
  color: #353d44;
  outline: none;
  font-size: 0.12rem;
  color: #93999f;
  width: 2.8rem;
  line-height: 0.3rem;
  height: 0.3rem;
  padding-left: 8px;
}
.index-banklist {
  // position: relative;
  width: 100%;
  min-height: 100%;
  background: #ffffff;
}
.tabbar {
  width: 3.43rem;
  margin: 0 auto 0.1rem;
  display: flex;
  .tabbar-item {
    height: 0.44rem;
    border: 1px solid #3399ff;
    flex: auto;
    text-align: center;
    line-height: 0.44rem;
    font-size: 0.16rem;
    color: #3399ff;
    &:first-child {
      border-radius: 0.05rem 0 0 0.05rem;
      border-right: none;
    }
    &:last-child {
      border-radius: 0 0.05rem 0.05rem 0;
    }
    &.active {
      background-color: #3399ff;
      color: #fff;
    }
  }
}
.list-box {
  overflow: hidden;
  .char {
    height: 0.4rem;
    line-height: 0.4rem;
    background-color: #ededed;
    padding-left: 0.1rem;
    font-size: 0.16rem;
    color: #6f6e74;
    margin-top: -0.01rem;
  }
  .bank-item {
    // padding: 0.15rem 0;
    padding-left: 0.1rem;
    .box-border {
      border-bottom: 1px solid #e9e9e9;
      height: 0.7rem;
      padding: 0.04rem 0;
      .icon-bank {
        width: 0.25rem;
        height: 0.25rem;
        float: left;
        img {
          width: 0.25rem;
          height: 0.25rem;
        }
      }
    }
    .content {
      //   padding-left: 0.1rem;
      //   border-bottom:1px solid #e9e9e9;
      height: 0.58rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      //   margin-left: 0.35rem;
      .bank-name {
        font-size: 0.16rem;
        padding-bottom: 0.06rem;
        .bank-name-detail {
          margin-left: 0.35rem;
          line-height: 0.25rem;
        }
      }
      .limit {
        margin-left: 0.35rem;
        .limit-text {
          font-size: 0.14rem;
          color: #999;
        }
      }
    }
  }
}
.sidebar {
  position: fixed;
  width: 0.2rem;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  padding: 0.2rem 0;
  color: #007bfd;
  background: #fff;
  .sidebar-item {
    display: block;
    text-align: center;
    height: 0.16rem;
    line-height: 0.16rem;
  }
}
</style>
