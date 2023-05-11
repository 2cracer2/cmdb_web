<template>
  <div>
    <input v-model="ip" placeholder="Enter IP">
    <button @click="connect">Connect</button>
    <button @click="disconnect">Disconnect</button>
    <div ref="terminal" class="terminal"></div>
  </div>
</template>

<script>
import { Terminal } from 'xterm'
import 'xterm/css/xterm.css'

export default {
  data() {
    return {
      term: null,
      socket: null,
      ip: '',
    }
  },
  methods: {
    connect() {
      this.initTerm()
      this.initSocket()
    },
    disconnect() {
      if (this.socket) {
        this.socket.close()
        this.socket = null
      }
      if (this.term) {
        this.term.dispose()
        this.term = null
      }
    },
    initTerm() {
      this.term = new Terminal()
      this.term.open(this.$refs.terminal)
      this.term.onData(data => {
        if (this.socket) {
          this.socket.send(JSON.stringify({ command: data }))
        }
      })
    },
    initSocket() {
      this.socket = new WebSocket(`ws://127.0.0.1:8000/ws/ssh/${this.ip}`)
      this.socket.onopen = () => {
        console.log('WebSocket connected')
      }
      this.socket.onclose = () => {
        console.log('WebSocket disconnected')
      }
      this.socket.onerror = error => {
        console.error(`WebSocket error: ${error}`)
      }
      this.socket.onmessage = event => {
        const data = JSON.parse(event.data)
        this.term.write(data.message)
      }
    }
  }
}
</script>

<style scoped>
.terminal {
  width: 100%;
  height: 500px;
}
</style>
