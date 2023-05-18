<template>
  <div>
    <el-select v-model="selectedIp" placeholder="请选择IP">
      <el-option v-for="item in serverIps" :key="item" :label="item" :value="item">
      </el-option>
    </el-select>

    <el-button type="primary" @click="connect">连接</el-button>
    <el-button type="danger" @click="disconnect">断开</el-button>

    <el-select v-model="selectedCommand" placeholder="请选择操作">
      <el-option v-for="item in commands" :key="item" :label="item.label" :value="item.command">
      </el-option>
    </el-select>

    <el-button type="success" @click="executeCommand">执行</el-button>

    <div ref="xterm" class="terminal" :style="styleVar" />
  </div>
</template>

<script>
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { getserverIP } from '@/api/server'


export default {
  name: 'xterm',
  props: {
    height: {
      type: Number,  // xterm显示屏幕，高度
      default: 100,
    },
  },
  data() {
    return {
      term: null,
      socket: null,
      serverIps: [],
      selectedIp: '',
      commands: [
        { label: "显示操作系统", command: "uname -a" },
        { label: "查看负载值", command: "uptime" },
        // 添加更多命令...
      ],
      selectedCommand: null,
    }
  },
  computed: {   // 动态设置xterm显示屏幕高度
    styleVar() {
      return {
        '--terminal-height': this.height + "vh"
      }
    }
  },
  mounted() {  // 初始化链接
    this.init()
    this.fetchServerIps()
  },
  beforeDestroy() {  // 退出销毁链接
    this.socket.close()
    this.term.dispose()
  },
  methods: {
    async fetchServerIps() {
      const response = await getserverIP()
      console.log(response)  // 打印响应内容
      this.serverIps = response.data.ips
      console.log(this.serverIps)  // 打印处理后的serverIps数组
    },
    init() {  // 初始化Terminal
      this.term = new Terminal({
        fontSize: 18,
        convertEol: true, // 启用时，光标将设置为下一行的开头
        rendererType: 'canvas', // 渲染类型
        cursorBlink: true, // 光标闪烁
        cursorStyle: 'bar', // 光标样式 underline
        theme: {
          background: '#060101', // 背景色
          cursor: 'help' // 设置光标
        }
      })
    },
    connect() {
      this.initSocket(this.selectedIp)
    },
    disconnect() {
      this.socket.close()
      this.term.dispose()
    },
    executeCommand() {
      // this.term.writeln(this.selectedCommand)  // 发送命令到终端
      // this.socket.send(JSON.stringify({ data: this.selectedCommand }))  // 发送命令到服务器
      if (this.selectedCommand) {
        this.term.writeln(this.selectedCommand);
        this.socket.send(JSON.stringify({ data: this.selectedCommand + "\r" }));
      }
    },
    initSocket(ip) {  // 初始化Websocket
      const fitPlugin = new FitAddon()
      this.term.loadAddon(fitPlugin)
      this.socket = new WebSocket(`ws://127.0.0.1:8000/ws/ssh/${ip}`)
      this.socket.onmessage = e => {
        const reader = new window.FileReader()
        reader.onload = () => this.term.write(reader.result)
        reader.readAsText(e.data, 'utf-8')
      }
      this.socket.onopen = () => {
        this.term.open(this.$refs.xterm)
        this.term.focus()
        fitPlugin.fit()
      }
      this.socket.onclose = e => {
        if (e.code === 1234) {  // 结束标记
          window.location.href = 'about:blank'
          window.close()
        } else {
          setTimeout(() => this.term.write('\r\nConnection is closed.\r\n'), 200)
        }
      }
      this.term.onData(data => this.socket.send(JSON.stringify({ data })))
      this.term.onResize(({ cols, rows }) => {
        this.socket.send(JSON.stringify({ resize: [cols, rows] }))
      })
      window.onresize = () => fitPlugin.fit()
    }
  }
}
</script>

<style lang="scss" scoped>
.terminal {
  display: flex;
  width: 100%;
  min-height: var(--terminal-height);
  flex: 1;
  background-color: #000;
}

.terminal>div {
  flex: 1;
}
</style>
