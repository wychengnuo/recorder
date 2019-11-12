import $ from 'jquery';
import recordering from './recorder';
import './index.css';
window.οnlοad = function () {
    document.documentElement.style.webkitTouchCallout = 'none';
};

$(function () {
    var lock = false;
    var recorder;
    var HZRecorder = recordering(window);

    // 获取音频
    var audio = document.querySelector('audio');

    // 绑定事件
    document.getElementById('startBtn').addEventListener('mousedown', function (e) {
        if (lock) return;
        startRecording();
        lock = true;
    });
    document.getElementById('startBtn').addEventListener('mouseup', function (e) {
        $('.animate').hide();
        stopRecording();
        // 上传音频文件
        uploadFile();
    });
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
        uploadFile();
    });

    // 上传音频文件
    function uploadFile() {
        recorder.upload('/test', function (data) {
            playRecording(data);
            addEvent();
        })
    }

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
                '<a href="javascript:;" class="play"></a>' +
            '</p>' +
            '<div class="record-content">' + answer + '</div>' +
            '</div>';

        var recording = document.getElementsByClassName('recording')[0];
        recording.innerHTML = leftElement + rightElement;
        // 自动播放
        audio.src = window.URL.createObjectURL(answerAudio);
        audio.play();
    }

    // 点击播放
    function addEvent() {
        var playBtn = document.getElementsByClassName('play');
        if (playBtn && playBtn[0]) {
            playBtn[0].onclick = function (e) {
                audio.play();
            };
        }
    }
});