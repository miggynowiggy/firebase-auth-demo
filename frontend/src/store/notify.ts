import { defineStore } from 'pinia'

interface INotifyOptions {
  title?: string
  text: string
  type: 'success' | 'error' | 'warning' | 'info'
  timeout?: number
  dismissible?: boolean
  actionButtonText?: string
}

export const useNotify = defineStore('notify', {
  state: () => ({
    showNotif: false,
    title: '',
    text: '',
    type: '',
    timeout: 6000,
    dismissible: true,
    actionButtonText: 'Close',
  }),
  actions: {
    toggleNotif(notifState: boolean) {
      this.showNotif = notifState
    },
    show(options: INotifyOptions) {
      this.showNotif = true
      this.title = options?.title ?? ''
      this.text = options.text
      this.type = options.type
      this.timeout = options?.timeout ?? 6000
      this.dismissible = options?.dismissible ?? true
      this.actionButtonText = options?.actionButtonText ?? 'Close'
    },
  },
})
