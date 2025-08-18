
"use client";

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Alert {
  id: number;
  message: string;
  read: boolean;
  createdAt: string;
  contractId: number;
  contract: {
    name: string;
  };
}

export default function Notifications() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/alerts');
      if (response.ok) {
        const data: Alert[] = await response.json();
        setAlerts(data);
        setUnreadCount(data.filter(a => !a.read).length);
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    }
  };

  useEffect(() => {
    fetchAlerts();
    // Optional: Poll for new alerts periodically
    const interval = setInterval(fetchAlerts, 60000); // every minute
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id: number) => {
    // Optimistic UI update
    setAlerts(alerts.map(a => a.id === id ? { ...a, read: true } : a));
    setUnreadCount(prev => prev - 1);

    try {
      await fetch(`/api/alerts?id=${id}`, { method: 'PATCH' });
      // No need to re-fetch, UI is already updated
    } catch (error) {
      console.error('Failed to mark alert as read:', error);
      // Rollback UI update on failure
      setAlerts(alerts.map(a => a.id === id ? { ...a, read: false } : a));
      setUnreadCount(prev => prev + 1);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Notificações</h4>
            <p className="text-sm text-muted-foreground">
              Você tem {unreadCount} {unreadCount === 1 ? 'notificação não lida' : 'notificações não lidas'}.
            </p>
          </div>
          <div className="grid gap-2 max-h-96 overflow-y-auto">
            {alerts.length === 0 ? (
              <p className="text-sm text-center text-muted-foreground">Nenhuma notificação.</p>
            ) : (
              alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-2 rounded-md ${!alert.read ? 'bg-blue-50' : ''}`}
                >
                  <p className="text-sm font-medium">{alert.contract.name}</p>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Link href={`/contracts/${alert.contractId}`} passHref>
                      <Button variant="link" size="sm" onClick={() => setIsOpen(false)}>
                        Ver Contrato
                      </Button>
                    </Link>
                    {!alert.read && (
                      <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(alert.id)}>
                        Marcar como lida
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
