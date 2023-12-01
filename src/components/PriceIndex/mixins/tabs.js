export const tabs = {
  computed: {
    interval() {
      // days
      let interval = Math.ceil(
        Math.abs(new Date(this.datepicker.to).getTime() - new Date(this.datepicker.from).getTime()) / (1000 * 3600 * 24)
      );

      switch (this.current_period) {
        case 'M1':
          interval = interval * 24 * 60;
          break;
        case 'M15':
          interval = interval * 24 * 4;
          break;
        case 'H1':
          interval *= 24;
          break;
        case 'H4':
          interval *= 6;
          break;
        case 'D1':
          break;
        default:
          break;
      }
      return interval;
    },
  },
};
