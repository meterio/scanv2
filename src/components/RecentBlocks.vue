<template>
  <b-container class="container">
    <b-card header="Recent Blocks">
      <b-card-text>
        <ul class="block-ul">
          <li>
            <b-row>
              <b-col>
                <div class="height-view">
                  <div class="block-icon"></div>

                  <div class="height">
                    <h4 class="number">83984</h4>
                    <span class="ago">23 sec ago</span>
                  </div>
                </div>
              </b-col>

              <b-col>
                <div class="signed-view">
                  <p>Signed by <a href="#">HQ</a></p>
                </div>
              </b-col>

              <b-col>
                <div class="detail-view">
                  <span class="detail">45 tx</span>
                </div>
              </b-col>
            </b-row>
          </li>

          <li>
            <b-row>
              <b-col>
                <div class="height-view">
                  <div class="block-icon"></div>

                  <div class="height">
                    <h4 class="number">83984</h4>
                    <span class="ago">23 sec ago</span>
                  </div>
                </div>
              </b-col>

              <b-col>
                <div class="signed-view">
                  <p>Signed by <a href="#">HQ</a></p>
                </div>
              </b-col>

              <b-col>
                <div class="detail-view">
                  <span class="detail">45 tx</span>
                </div>
              </b-col>
            </b-row>
          </li>

          <li>
            <b-row>
              <b-col>
                <div class="height-view">
                  <div class="block-icon"></div>

                  <div class="height">
                    <h4 class="number">83984</h4>
                    <span class="ago">23 sec ago</span>
                  </div>
                </div>
              </b-col>

              <b-col>
                <div class="signed-view">
                  <p>Signed by <a href="#">HQ</a></p>
                </div>
              </b-col>

              <b-col>
                <div class="detail-view">
                  <span class="detail">45 tx</span>
                </div>
              </b-col>
            </b-row>
          </li>
        </ul>
      </b-card-text>
    </b-card>
  </b-container>
</template>

<script>
export default {
  name: "RecentBlocks"
};
</script>

<style lang="scss" scoped>
.container {
  margin: 20px auto;
  padding: 0;
}

.block-ul {
  li {
    margin: 10px 0;
  }
}

.height-view {
  display: flex;

  .block-icon {
    background-image: url("~@/assets/block.png");
    background-color: #ebeef6;
    background-repeat: no-repeat;
    background-position: center;
    width: 50px;
    height: 50px;
    border-radius: 5px;
  }

  .height {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .number {
      font-size: 1rem;
      color: #0c2954;
      margin: 0;
      padding: 0;
    }

    .ago {
      font-size: 13px;
      color: #a6b5cc;
    }
  }
}

.signed-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;

  p {
    font-size: 14px;
    color: #5c6f8c;
    margin: 0;
  }
}

.detail-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;

  .detail {
    padding: 3px 6px;
    font-size: 13px;
    color: #5c6f8c;
    background: #ebeef6;
    border-radius: 5px;
    width: 50px;
    text-align: center;
  }
}
</style>
