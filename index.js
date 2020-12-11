

			function observe(data) {
				if(!data || typeof data !== 'object') return
				Object.keys(data).forEach((key) => {
					defineProperty(data, key, data[key])
				})
			}

			function defineProperty(data, key, val) {
				observe(val)
				var dep = new Dep()
				Object.defineProperty(data, key, {
					enumberable: true,
					configurable: true,
					get: function() {
						console.log('get', key, val, data,Dep.target)
						if(Dep.target) {
							dep.addSub(Dep.target)
						}
						return val
					},
					set: function(newVal) {
						console.log('set',key,val)
						if(val === newVal) return
						val = newVal
						dep.notify()

					}
				})
			}

			function Dep() {
				this.subs = []
			}
			Dep.prototype = {
				addSub: function(sub) {
					this.subs.push(sub)
				},
				notify: function() {
					this.subs.forEach(function(sub) {
						sub.update()
					})
				}
			}

			function Watcher(vm, exp, cb) {
				this.vm = vm
				this.exp = exp
				this.cb = cb
				this.value = this.get();
			}
			Watcher.prototype = {
				update: function() {
					this.run()
				},
				run: function() {
					var value = this.vm.data[this.exp];
					var oldVal = this.value;
					console.log(value, oldVal, 'run', this.vm.data)
					if(value !== oldVal) {
						this.value = value;
						this.cb.call(this.vm, value, oldVal)
					}
				},
				get: function() {
					Dep.target = this;
					var value = this.vm.data[this.exp]
					Dep.target = null
					return value
				}
			}

