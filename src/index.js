import $ from 'jquery';
import recordering from './recorder';
import './index.css';
window.οnlοad = function () {
    document.documentElement.style.webkitTouchCallout = 'none';
};

$(function () {
    var array = [];
    var lock = false;
    var recorder;
    var HZRecorder = recordering(window);

    // 获取音频
    var audio = document.querySelector('audio');

    // 绑定事件
    document.getElementById('startBtn').addEventListener('touchstart', function (e) {
        e.preventDefault();
        if (lock) return;
        startRecording();
        lock = true;
    });
    document.getElementById('startBtn').addEventListener('touchmove', function (e) {
        e.preventDefault();
    });
    document.getElementById('startBtn').addEventListener('touchend', function (e) {
        e.preventDefault();
        $('.animate').hide();
        stopRecording();

        // 上传音频文件
        // recorder.upload('http://localhost:9800/test', function (data) {
        recorder.upload('/api/test', function (data) {
            playRecording(data);
            addEvent();
            // recorder.play2(audio, array[0]);
        })
    });

    // 开始录音
    function startRecording() {
        HZRecorder.get(function (rec) {
            // 展示录音动画
            $('.animate').show();
            recorder = rec;
            recorder.start();
        });
    }

    // 停止录音
    function stopRecording() {
        lock = false;
        recorder.stop();
    }

    // 展示录音信息和回答
    function playRecording(data) {
        const {
            answerAudio,
            query,
            answer,
            test,
        } = data;
        var leftElement = '<div class="record-item left">' +
            '<p class="record-time">query</p>' +
            '<div class="record-content">' + query + '</div>' +
            '</div>';
        var rightElement = '<div class="record-item right">' +
            '<p class="record-time flex">' +
                'answer' +
                '<a href="javascript:;" class="play" id="' + array.length + '_id"></a>' +
            '</p>' +
            '<div class="record-content">' + answer + '</div>' +
            '</div>';

        var container = document.createElement('div');
        container.setAttribute('class', 'record-container');
        container.innerHTML = leftElement + rightElement;
        array.push(answerAudio);
        document.getElementsByClassName('recording')[0].appendChild(container);
    }

    // 添加动画
    function addAnimate() {
        $('.animate').html(
            '<div class="round round1"></div><div class="round round2"></div><div class="round round3"></div>'
        );
    }

    // 点击播放
    function addEvent() {
        var playBtn = document.getElementsByClassName('play');
        if (playBtn && playBtn[0]) {
            playBtn[0].onclick = function (e) {
                var id = e.target.getAttribute('id');
                var index = id.substring(0, id.indexOf('_'));

                var data = array[index];
                if (data) {
                    audio.src = window.URL.createObjectURL(data);
                    audio.play();
                }
            };
        }
    }
});