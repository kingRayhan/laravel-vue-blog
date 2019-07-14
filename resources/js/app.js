require('./bootstrap')
import Vue from 'vue'
import Home from './home.vue'

new Vue({
    el: '#root',
    render: rayhan => rayhan(Home),
})
