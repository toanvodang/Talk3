import io from 'socket.io-client';

const SocketIOService = function ({ token }) {
    const SOCKET_URL = 'wss://chat.cybercode88.com';
    const socket = io(SOCKET_URL, {
        autoConnect: true,
        withCredentials: true,
        secure: true,
        jsonp: false,
        auth: {
            token: 'Koh ' + token
        }
    })

    return socket;

    // socket.on('user_info', (data) => {

    //     const { me, lastMessages } = data,
    //         { messages } = lastMessages;

    //     if (me.avatar) {
    //         me.avatar = 'https://chat.cybercode88.com/' + me.avatar;
    //     }
    //     else {
    //         me.avatar = null;
    //     }

    //     messages.sort((a, b) => {
    //         return parseInt(b.createdAt) - parseInt(a.createdAt);
    //     });

    //     setUserInfo({ ...data });
    // })

    // socket.on('chat_online', (data) => {
    //     console.log(userInfo, data, 'chat_online---');
    // })

    // socket.on('user_offline', (data) => {
    //     // console.log(data, 'user_offline---');
    //     // const { friendsOnline } = userInfo;
    //     console.log(userInfo, data, 'user_offline');
    //     // setUserInfo({
    //     //     ...userInfo,
    //     //     friendsOnline: friendsOnline.filter(item => item._id != data._id)
    //     // })
    // })

    // socket.on('user_online', (data) => {
    //     console.log(data, userInfo, 'user_online---');
    //     // const { friendsOnline } = userInfo;
    //     // setUserInfo({
    //     //     ...userInfo,
    //     //     friendsOnline: friendsOnline.push(data)
    //     // })
    // })

    // socket.on('friends_online', (data) => {
    //     console.log(data, 'friends_online---');
    // })

    // socket.on('friends_offline', (data) => {
    //     console.log(data, 'friends_offline---');
    // })

    // socket.emit('add_friend', {
    //     _idFriend: "6318853590e420cd58b072bb"
    // }, (data) => {
    //     console.log(data, 'add_friend--');
    // })

    // socket.emit('block_or_unblock_friend', {
    //     _idFriend: "63475c7310091895320f389a",
    //     status: 1//chặn
    // }, (data) => {
    //     console.log(data, 'block_or_unblock_friend--');
    // })

    // socket.emit('block_or_unblock_friend', {
    //     _idFriend: "63475c7310091895320f389a",
    //     status: 0//bỏ chặn
    // }, (data) => {
    //     console.log(data, 'block_or_unblock_friend--');
    // })

    // socket.emit('preload', {
    //     offset: 0,
    //     size: 20,
    //     _groupID: "63475cac10091895320f38c7"
    // }, (data) => {
    //     console.log(data, 'preload--');
    // })

    // socket.on('message', (data) => {
    //     console.log(data, 'mess');
    // })

    // socket.emit('create_group', {
    //     groupPrefix: "@g2",
    //     name: "g22"
    // }, (data) => {
    //     console.log(data, 'create_group--');
    // })

    // socket.emit('leave_group', {
    //     _idGroup: "63625e776cca054bf5858842"
    // }, (data) => {
    //     console.log(data, 'leave_group--');
    // })

    // socket.emit('add_members_to_group', {
    //     _idGroup: "63625e366cca054bf5858837",
    //     _idMembers: "6318853590e420cd58b072bb"
    // }, (data) => {
    //     console.log(data, 'add_members_to_group--');
    // })

    // let mess = {
    //     // to: '63454058ecde5be6045abcdf',to group
    //     // to: '63475cac10091895320f38c7',
    //     to: '63453bf3ecde5be6045abbdf',
    //     type: 0,
    //     message: '123 gửi cho 32111...'
    // };

    // socket.emit("message", mess, (rep) => {
    //     console.log(rep, 'rep');
    //     // if (rep.success == 0) {
    //     //     this.$toast(`${rep.error}`, {
    //     //         position: "top-right",
    //     //         icon: Icon.components.Error,
    //     //     });
    //     // }

    //     // mess.from = this.user._id;
    //     // mess.createdAt = rep.data.createdAt;
    //     // mess.media = this.media;
    //     // this.$store.dispatch("PUSH_MESSAGE", mess);
    //     // this.$store.dispatch("PUSH_LAST_MESSAGES", mess);
    //     // this.media = null;
    //     // this.mediaMessage = "";
    //     // // this.playAudio();
    //     // this.scrollToEnd();
    // });

}

export default SocketIOService;