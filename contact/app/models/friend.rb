class Friend < ActiveRecord::Base
	after_create{|friend| friend.message 'create'}

	def message action
		msg = {
			resource: 'friends',
			action: action,
			id: self.id,
			obj: self
		}
		$redis.publish 'rt-change', msg.to_json
	end
end
