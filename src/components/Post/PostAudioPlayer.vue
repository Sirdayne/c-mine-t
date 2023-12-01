<template>
  <div class="post-audio-player">
    <a
      class="btn post-audio-player__btn post-audio-player__download-btn"
      :href="src"
      :data-gtm-locator="`article_${postId}_clickon_download`"
      title="Download as mp3"
    >
      <span class="btn__wrp">
        <span class="btn__icon post-audio-player__download-icon" />
      </span>
    </a>
    <span class="post-audio-player__delimiter" />
    <button
      class="btn post-audio-player__btn post-audio-player__play-btn"
      type="button"
      :data-gtm-locator="locatorName"
      @click="setPlayerState"
    >
      <span class="btn__wrp">
        <span
          class="btn__icon post-audio-player__player-icon"
          :class="iconClassName"
        />
      </span>
    </button>
    <div class="post-audio-player__meta">
      {{ currentTime }}
    </div>
    <audio
      ref="audio"
      class="post-audio-player__audio"
      :src="src"
      @ended="setPlayerState"
      @loadedmetadata="setDuration"
      @timeupdate="updateCurrentTime"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { POST } from '~/store/types';
import getProperty from '~/assets/libs/getProperty';

export default {
  name: 'PostAudioPlayer',
  props: {
    src: {
      type: String,
      default: '',
    },
    postId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isPlaying: false,
      secondsLeft: 0,
      seconds: 0,
    };
  },
  computed: {
    ...mapState('post', {
      currentPlayerId: ({ currentPlayerId }) => currentPlayerId,
    }),
    iconClassName() {
      return this.isPlaying ? 'post-audio-player__pause-icon' : 'post-audio-player__play-icon';
    },
    currentTime() {
      const { seconds, secondsLeft } = this;
      const currentSeconds = seconds - secondsLeft;
      return `${this.formatTime('minutes', currentSeconds)}:${this.formatTime('seconds', currentSeconds)}`;
    },
    locatorName() {
      return this.isPlaying ? `article_${this.postId}_clickon_pause` : 'article_clickon_play';
    },
  },
  watch: {
    currentPlayerId(newPlayerId) {
      this.playing = newPlayerId === this.postId;
    },
  },
  methods: {
    ...mapActions('post', {
      setPlayerId: POST.SET_PLAYER_ID,
    }),
    formatTime(typeOfTime, seconds) {
      switch (typeOfTime) {
        case 'seconds': {
          const calculatedSeconds = Math.floor(seconds > 60 ? seconds - (Math.ceil(seconds / 60) - 1) * 60 : seconds);
          return calculatedSeconds < 10 ? `0${calculatedSeconds}` : calculatedSeconds;
        }
        case 'minutes': {
          return seconds > 60 ? Math.floor(seconds / 60) : 0;
        }
        default:
          return 0;
      }
    },
    updateCurrentTime(event) {
      this.secondsLeft = event.target.currentTime;
    },
    setDuration() {
      const audio = getProperty(this.$refs, 'audio', null);
      if (!this.isAudioSourceValid()) {
        return;
      }
      this.seconds = audio.duration;
    },
    setPlayerState() {
      const audio = getProperty(this.$refs, 'audio', null);
      if (!this.isAudioSourceValid()) {
        return;
      }
      if (this.isPlaying) {
        this.setPlayerId(null);
        this.isPlaying = false;
        audio.pause();
      } else {
        this.setPlayerId(this.postId);
        this.isPlaying = true;
        audio.play();
      }
    },
    isAudioSourceValid() {
      const audio = getProperty(this.$refs, 'audio', null);
      return Boolean(audio && !Number.isNaN(audio.duration));
    },
  },
};
</script>

<style scoped lang="scss">
@use '~/assets/styles/_icons-common.scss' as icons;

.post-audio-player {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  height: 100%;
  background-color: #253137;
}
.post-audio-player__btn {
  display: block;
  width: 34px;
  height: 30px;
}
.post-audio-player__delimiter {
  display: block;
  width: 1px;
  height: 30px;
  background-color: #eceff2;
}
.post-audio-player__download-icon,
.post-audio-player__player-icon {
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
.post-audio-player__download-icon {
  @include icons.enter(#ffffff);
  width: 13px;
  height: 13px;
  transform: rotate(90deg);
}
.post-audio-player__player-icon {
  width: 12px;
  height: 12px;
}
.post-audio-player__pause-icon {
  @include icons.pause(#ffffff);
}
.post-audio-player__play-icon {
  @include icons.play(#ffffff);
}
.post-audio-player__meta {
  margin: 0 10px;
  color: #ffffff;
}
.post-audio-player__audio {
  display: none;
}
</style>
