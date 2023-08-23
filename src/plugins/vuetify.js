import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
          light: {
            primary:"#4DC1CF",
            appColor: "#4DC1CF",
            appLightColor : "#bee2e6",
            mainTextColor: "#000000",
            navBarTextColor : "#FFFFFF",
            secondaryTextColor: "#B3B3B3",
            backgroundColorSuccess: "#EDF4F5",
            pendingBackGroundColor : "#D7816A",
            pendingColor : "#FFFFFF",
            completedBackgroundColor : "#547F6D",
            completedColor : "#FFFFFF",
            backgroundLightColor : "#F6F6F6",
            backgroundFAQColor : "#F9F9F9",
            inputBackground: "#FBFAFD",
          },
        },
        options: {
          customProperties: true
        }
      },
});
