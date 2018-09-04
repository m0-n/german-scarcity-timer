(function () {
    jQuery(function ($) {
        var currentTimer, serverNow, timerData, timerId, _ref;
        serverNow = parseInt(timerData.now);
        currentTimer = (function () {
            function currentTimer($timerWrapper, timerData) {
                var clientNow, _ref, _this = this;
                this.$timerWrapper = $timerWrapper;
                this.$days = $('.ss-days', this.$timerWrapper);
                this.$hours = $('.ss-hours', this.$timerWrapper);
                this.$minutes = $('.ss-minutes', this.$timerWrapper);
                this.$seconds = $('.ss-seconds', this.$timerWrapper);
                clientNow = this.getUnixTimestamp();
                this.serverTimeOffset = clientNow - serverNow;
                this.deadline = timerData.deadline;
                if (this.$timerWrapper.is('.ss-styled-timer')) {
                    this.format = 'styled';
                } else {
                    this.format = (_ref = timerData.format) != null ? _ref : 'text';
                }
                this.redirectURL = timerData.redirect_url;
                this.value = this.updateTimer();
                this.intervalID = setInterval(function () {
                    _this.value = _this.updateTimer();
                    if (_this.value > 0) {
                        return;
                    }
                    clearInterval(_this.intervalID);
                    _this.onExpire();
                }, 1000);
            }
            currentTimer.prototype.getUnixTimestamp = function () {
                return Math.round((new Date()).getTime() / 1000);
            };
            currentTimer.prototype.pluralize = function (count, word) {
                return count + ' ' + word + (count === 1 ? '' : 's');
            };
            currentTimer.prototype.zeroPrefix = function (number) {
                if (number < 10) {
                    return "0" + number;
                } else {
                    return "" + number;
                }
            };
            currentTimer.prototype.updateTimer = function () {
                var days, hours, minutes, seconds, timerText, timerValue, value;
                timerValue = value = Math.max(this.deadline - this.getUnixTimestamp() + this.serverTimeOffset, 0);
                days = Math.floor(value / 86400);
                value -= days * 86400;
                hours = Math.floor(value / 3600);
                value -= hours * 3600;
                minutes = Math.floor(value / 60);
                value -= minutes * 60;
                seconds = value;
                switch (this.format) {
                case 'styled':
                    this.$days.text(this.zeroPrefix(days));
                    this.$hours.text(this.zeroPrefix(hours));
                    this.$minutes.text(this.zeroPrefix(minutes));
                    this.$seconds.text(this.zeroPrefix(seconds));
                    break;
                case 'text':
                    timerText = (function () {
                        switch (false) {
                        case !(days > 0):
                            return this.pluralize(days, 'day');
                        case !(hours > 0):
                            return this.pluralize(hours, 'hour');
                        case !(minutes > 0):
                            return this.pluralize(minutes, 'minute');
                        default:
                            return this.pluralize(seconds, 'second');
                        }
                    }).call(this);
                    this.$timerWrapper.text(timerText);
                    break;
                case 'digital':
                    timerText = [this.zeroPrefix(days), this.zeroPrefix(hours), this.zeroPrefix(minutes), this.zeroPrefix(seconds)].join(':');
                    this.$timerWrapper.text(timerText);
                }
                return timerValue;
            };
            currentTimer.prototype.onExpire = function () {
                //if (this.redirectURL == null) {
                   //window.location=window.redirect;
               // }
			   if(! $.cookie('rdirbytimer')){
				 $.cookie('rdirbytimer','1');
                 window.onbeforeunload = null;
                 window.location=window.redirect;
			   }
            };
            return currentTimer;
        })();
        if (timerData.timer != null) {
            _ref = timerData.timer;
            for (timerId in _ref) {
                timerData = _ref[timerId];
                new currentTimer($(".ss-timer-" + timerId), timerData);
            }
        }
        if (timerData.end_time_timer != null) {
            new currentTimer($(), timerData.end_time_timer);
        }
        return $('.ss-inline-timer').each(function () {
            var format, timestamp;
            timestamp = parseInt($(this).data('ss-timer-timestamp'));
            if (isNaN(timestamp)) {
                timestamp = null;
            }
            format = $(this).data('ss-timer-format');
            timerData = {
                deadline: timestamp != null ? timestamp : timerData.end_time_timer.deadline,
                format: format
            };
            return new currentTimer($(this), timerData);
        });
    });
}).call(this);
