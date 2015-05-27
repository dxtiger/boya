var data = {
	item_id: '0001',
	title: '测试音乐标题',
	icon: 'http://tsharer.oss-cn-qingdao.aliyuncs.com/xbl/img/100x100.jpg',
	album_id: 'A001',
	subject_list: 'B001',
	anchor: '音频主播，后台暂时没有录入的地方，暂为空',
	from: '来自，后台暂时没有录入的地方，暂为空',
	media: 'http://tsharer.oss-cn-qingdao.aliyuncs.com/xbl/img/IndigoGuiBoratto.mp3',
	enjoy : {
		count : 1000,
		self_enjoy : false
	},
	comment : {
		count : 4,
		data : [
			{
				id: 'c001',
				user_id: 'u001',
				item_id: '0001',
				content: '评论的内容，1111',
				replay_id: '如果存在的话，表示回复的某个评论的ID，',
				user_name: '1用户的昵称，',
				user_mobile: '13661141008'
			},
			{
				id: 'c002',
				user_id: 'u002',
				item_id: '0002',
				content: '评论的内容，2222',
				replay_id: '如果存在的话，表示回复的某个评论的ID，',
				user_name: '2用户的昵称，',
				user_mobile: '22221141008'
			},
			{
				id: 'c003',
				user_id: 'u003',
				item_id: '0003',
				content: '评论的内容，333',
				replay_id: '如果存在的话，表示回复的某个评论的ID，',
				user_name: '3用户的昵称，',
				user_mobile: '33331141008'
			},
			{
				id: 'c004',
				user_id: 'u004',
				item_id: '0004',
				content: '评论的内容，4444',
				replay_id: '如果存在的话，表示回复的某个评论的ID，',
				user_name: '4用户的昵称，',
				user_mobile: '44441141008'
			}
		]
	}
}
callbackFn({'ok':true,'msg':data})