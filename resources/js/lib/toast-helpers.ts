import { toast } from '@/hooks/use-toast';

export const showToast = {
  success: (title: string, description?: string) => {
    toast({
      variant: "success",
      title,
      description,
    });
  },

  error: (title: string, description?: string) => {
    toast({
      variant: "destructive",
      title,
      description,
    });
  },

  warning: (title: string, description?: string) => {
    toast({
      variant: "warning",
      title,
      description,
    });
  },

  info: (title: string, description?: string) => {
    toast({
      variant: "info",
      title,
      description,
    });
  },

  // Lead-specific toasts
  leadCreated: (leadName: string) => {
    toast({
      variant: "success",
      title: "Lead berhasil dibuat",
      description: `Lead ${leadName} telah ditambahkan ke sistem`,
    });
  },

  leadUpdated: (leadName: string) => {
    toast({
      variant: "success",
      title: "Lead berhasil diperbarui",
      description: `Informasi ${leadName} telah diperbarui`,
    });
  },

  leadDeleted: (leadName: string) => {
    toast({
      variant: "success",
      title: "Lead berhasil dihapus",
      description: `Lead ${leadName} telah dihapus dari sistem`,
    });
  },

  // Follow-up specific toasts
  followUpCompleted: (leadName: string, stage: string) => {
    toast({
      variant: "success",
      title: "Follow-up selesai",
      description: `Follow-up ${stage} untuk ${leadName} telah diselesaikan`,
    });
  },

  followUpScheduled: (leadName: string, stage: string, date: string) => {
    toast({
      variant: "info",
      title: "Follow-up dijadwalkan",
      description: `Follow-up ${stage} untuk ${leadName} dijadwalkan pada ${date}`,
    });
  },

  followUpOverdue: (count: number) => {
    toast({
      variant: "warning",
      title: "Follow-up terlambat",
      description: `Anda memiliki ${count} follow-up yang terlambat`,
    });
  },

  // Status change toasts
  leadStatusChanged: (leadName: string, newStatus: string) => {
    const statusMessages = {
      'WARM': 'menjadi Warm',
      'HOT': 'menjadi Hot',
      'CUSTOMER': 'menjadi Customer',
      'COLD': 'menjadi Cold',
      'EXIT': 'menjadi Exit',
      'CROSS_SELLING': 'menjadi Cross Selling'
    };

    toast({
      variant: "info",
      title: "Status lead diubah",
      description: `${leadName} ${statusMessages[newStatus as keyof typeof statusMessages] || `status diubah ke ${newStatus}`}`,
    });
  },

  // General system toasts
  saveSuccess: () => {
    toast({
      variant: "success",
      title: "Berhasil disimpan",
      description: "Data telah berhasil disimpan",
    });
  },

  saveError: () => {
    toast({
      variant: "destructive",
      title: "Gagal menyimpan",
      description: "Terjadi kesalahan saat menyimpan data",
    });
  },

  networkError: () => {
    toast({
      variant: "destructive",
      title: "Koneksi bermasalah",
      description: "Periksa koneksi internet Anda dan coba lagi",
    });
  },

  permissionError: () => {
    toast({
      variant: "destructive",
      title: "Akses ditolak",
      description: "Anda tidak memiliki izin untuk melakukan tindakan ini",
    });
  },

  validation: (message: string) => {
    toast({
      variant: "warning",
      title: "Data tidak valid",
      description: message,
    });
  }
};