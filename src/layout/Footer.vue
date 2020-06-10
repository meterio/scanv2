<template>
  <footer>
    <b-container>
      <b-row>
        <b-col>
          <div class="footer-meter">
            <img class="logo" src="@/assets/meter-logo.png" alt="logo" />
            <div class="copyright">
              <p>Copyright © 2019-{{ currentYear }}</p>
              <p>Decentralized Finance Labs inc.</p>
            </div>
            <br />
            <p class="blue">Download Meter Wallets!</p>
            <button class="desktop-btn">
              <i class="fas fa-laptop"></i>Desktop Wallets
            </button>
          </div>
        </b-col>
        <b-col>
          <div class="footer-social">
            <div class="sitemap">
              <ul class="footer-menu">
                <li>Dashboard</li>
                <li>Blockchain</li>
                <li>Auctions</li>
              </ul>
              <ul class="footer-menu">
                <li>Wallets</li>
                <li>Mining</li>
                <li>Documentation</li>
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
  name: "Footer",
  data() {
    return {
      currentYear: new Date().getFullYear(),
      socials: [
        {
          key: "github",
          value: "https://github.com"
        },
        {
          key: "telegram",
          value: "https://github.com"
        },
        {
          key: "instagram",
          value: "https://github.com"
        },
        {
          key: "twitter",
          value: "https://github.com"
        },
        {
          key: "discord",
          value: "https://github.com"
        },
        {
          key: "youtube",
          value: "https://github.com"
        },
        {
          key: "wechat",
          type: "image",
          value: "https://github.com"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
footer {
  flex-shrink: 0;
  width: 100%;
  background-color: $back-white;
  color: $third-font-color;
  margin-top: 20px;
  padding: 20px 0;
}

.footer-meter {
  grid-area: footer-meter;
  height: 100%;

  .logo {
    width: 100px;
    margin: 6px;
  }

  .copyright {
    font-size: 12px;

    p {
      margin: 0;
    }
  }
}

.fa,
.fas {
  padding-right: 8px;
}

footer .footer-social {
  grid-area: footer-social;
  height: 100%;
  padding-top: 16px;
}

.social-icons {
  display: flex;
  float: right;
  margin-top: 20px;

  li {
    padding-left: 20px;
    text-align: right;
    font-size: 23px;
  }
}

.sitemap {
  display: flex;
  justify-content: flex-end;

  .footer-menu {
    margin-left: 60px;

    li {
      text-align: center;
      padding-bottom: 20px;
    }
  }
}

footer .desktop-btn {
  background-color: $primary-color;
  color: white;
  width: 184px;
  height: 52px;
  font-size: 16px;
  //font-weight: 600;
  border: none;
  border-radius: 4px;
}

footer ul {
  list-style: none;
  padding-left: 0;
}

.icon {
  display: block;
  width: 23px;
  height: 23px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 23px auto;

  &.icon-github {
    background-image: url("~@/assets/socials/github.svg");
  }
  &.icon-wechat {
    background-image: url("~@/assets/socials/wechat.svg");
  }

  &.icon-youtube {
    background-image: url("~@/assets/socials/youtube.svg");
  }

  &.icon-twitter {
    background-image: url("~@/assets/socials/twitter.svg");
  }

  &.icon-instagram {
    background-image: url("~@/assets/socials/instagram.svg");
  }

  &.icon-discord {
    background-image: url("~@/assets/socials/discord.svg");
  }

  &.icon-telegram {
    background-image: url("~@/assets/socials/telegram.svg");
  }
}
</style>
