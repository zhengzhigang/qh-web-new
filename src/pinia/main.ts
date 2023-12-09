import { defineStore } from 'pinia'

export const mainStore = defineStore('main', {
    state: () => ({
        hidenLeft: false,
        checkVideo: false,
        headTeamId: '',
        isShowChoose: false,
        chooseList: [] as any[], // 视频会话人员列表
        chooseUserIds: [] as any[], // 视频会员用户id数组
        meetingRoomId: '', // 会议室id
        switchMeetingRoomInfo: {
            meetingRoomId: '',
            sponsorUserId: '',
            sponsorUserName: '',
            sponsorUserAvatar: ''
        }, // 切换会议室信息
        currentYear: 0, // 时间轴鼠标所在位置对应的年份
        isExpand: false,
        isExpandTyoe: null
    }),
    actions: {
        updateCheckVideo(check: boolean) {
            this.checkVideo = check
        },
        showCheck() {
            this.checkVideo = true
        },
        hideCheck() {
            this.checkVideo = false
        },
        updateHidenLeft(val: boolean) {
            this.hidenLeft = val
        },
        updateHeadTeamId(teamId: string) {
            this.headTeamId = teamId
        },
        updateIsShowChoose(val: boolean) {
            this.isShowChoose = val
        },
        updateMeetingRoomId(meetingRoomId: string) {
            this.meetingRoomId = meetingRoomId
        },
        updateSwitchMeetingRoomInfo(meetingRoomInfo: any) {
            this.switchMeetingRoomInfo = meetingRoomInfo
        },
        clearChooseList() {
            this.chooseList = []
            this.chooseUserIds = []
        },
        updateYear(val: number) {
            this.currentYear = val
        },
        updateExpandState(data = {}) {
            this.isExpand = data.val
            this.isExpandTyoe = data.type
        }
    }
})
// export const wsStore = defineStore("ws", {
//   state: () => ({
//     ws: null as any,
//     wsUrl: "https://www.reye.xyz",
//   }),
//   actions: {
//     updateWs(ws: any) {
//       this.ws = ws;
//     },
//   },
// });
