<template>
  <footer>
    <b-container>
      <b-row>
        <b-col cols="12" md="6">
          <div class="footer-meter">
            <div class="brand">
              <img class="logo" src="@/assets/meter-logo.png" alt="logo" />
              <div class="copyright">
                <p>Copyright © 2019-{{ currentYear }}</p>
                <p>Decentralized Finance Labs inc.</p>
              </div>
            </div>

            <div class="download-wallet">
              <!-- <p class="blue">Download Meter Wallets!</p> -->
              <a target="_blank" href="https://wallet.meter.io/" class="btn btn-outline-primary btn-sm">
                <b-icon icon="wallet" class="mr-1"></b-icon> Meter Web Wallet
              </a>
            </div>
            <div class="download-wallet">
              <a target="_blank" href="https://passport.meter.io/" class="btn btn-outline-primary btn-sm">
                <b-icon icon="link-45deg" class="mr-1"></b-icon> Bridge Assets
              </a>
            </div>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="footer-social">
            <div class="sitemap">
              <ul class="footer-menu">
                <li>
                  <router-link :to="{ name: 'home' }">Home</router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'pos' }">PoS chain</router-link>
                </li>
                <li v-if="currentChain.pow">
                  <router-link :to="{ name: 'pow' }">PoW chain</router-link>
                </li>
              </ul>
              <ul class="footer-menu">
                <li v-if="currentChain.pow">
                  <router-link :to="{ name: 'auction' }">Auction</router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'txList' }">Txs</router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'blockList' }">Blocks</router-link>
                </li>
              </ul>
            </div>
            <ul class="social-icons">
              <li v-for="social in socials" :key="social.key">
                <a
                  v-if="!social.type"
                  target="__blank"
                  :href="social.value"
                  :class="['icon', `icon-${social.key}`]"
                ></a>
              </li>
            </ul>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      currentYear: new Date().getFullYear(),
      socials: [
        {
          key: 'github',
          value: 'https://github.com/meterio',
        },
        {
          key: 'telegram',
          value: 'https://t.me/Meter_IO',
        },
        {
          key: 'instagram',
          value: 'https://www.instagram.com/meter.io/',
        },
        {
          key: 'twitter',
          value: 'https://twitter.com/Meter_IO',
        },
        {
          key: 'discord',
          value: 'https://discord.gg/XZgZsCn',
        },
        {
          key: 'youtube',
          value: 'https://www.youtube.com/channel/UCgQVD2Ab-i3IKUhjs6-Z76w',
        },
        // {
        //   key: "wechat",
        //   type: "image",
        //   value: "https://github.com",
        // },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
footer {
  border-top: 1px solid #dfdfdf;
  flex-shrink: 0;
  width: 100%;
  background-color: $back-white;
  color: $third-font-color;
  padding: 20px 0;

  ul {
    list-style: none;
    padding-left: 0;
  }

  .fa {
    padding-right: 8px;
  }

  // left side
  .footer-meter {
    grid-area: footer-meter;
    height: 100%;
    @include media('<=desktop') {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 1rem;
    }

    .brand {
      .logo {
        width: 100px;
        margin: 6px;
      }

      .copyright {
        font-size: 13px;
        p {
          margin: 0;
        }
      }
    }

    .download-wallet {
      margin-top: 10px;
      .btn-sm {
        border-radius: 0.75rem;
        padding: 0.25rem 0.5rem;
      }
      .desktop-btn {
        background-color: $primary-color;
        color: white;
        // width: 184px;
        padding: 8px 15px;
        font-size: 16px;
        //font-weight: 600;
        border: none;
        border-radius: 4px;
      }
    }
  }

  // right side
  .footer-social {
    grid-area: footer-social;
    height: 100%;
    padding-top: 16px;

    .sitemap {
      display: flex;
      justify-content: flex-end;

      @include media('<=desktop') {
        justify-content: space-evenly;
      }

      .footer-menu {
        @include media('>desktop') {
          margin-left: 60px;
        }
        a {
          font-size: 14px;
          color: #5c6f8c;
        }
        a:hover {
          font-weight: 600;
          color: #5c6f8c;
        }

        li {
          text-align: center;
          padding-bottom: 20px;
        }
      }
    }

    .social-icons {
      display: flex;

      @include media('>desktop') {
        float: right;
        margin-top: 20px;
      }

      @include media('<=desktop') {
        justify-content: center;
      }

      li + li {
        padding-left: 20px;
      }
      li {
        text-align: right;
        font-size: 23px;

        .icon {
          display: block;
          width: 23px;
          height: 23px;
          background-repeat: no-repeat;
          background-position: center center;
          background-size: 23px auto;

          &.icon-github {
            background-image: url('~@/assets/socials/github.svg');
          }
          &.icon-wechat {
            background-image: url('~@/assets/socials/wechat.svg');
          }

          &.icon-youtube {
            background-image: url('~@/assets/socials/youtube.svg');
          }

          &.icon-twitter {
            background-image: url('~@/assets/socials/twitter.svg');
          }

          &.icon-instagram {
            background-image: url('~@/assets/socials/instagram.svg');
          }

          &.icon-discord {
            background-image: url('~@/assets/socials/discord.svg');
          }

          &.icon-telegram {
            background-image: url('~@/assets/socials/telegram.svg');
          }
          &:hover,
          &:focus {
            filter: invert(27%) sepia(51%) saturate(2878%) hue-rotate(200deg) brightness(104%) contrast(97%);
          }
        }
      }
    }
  }
}
</style>
