import { useState, useEffect } from "react";
import { Bell, Plus, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Reminder {
  id: string;
  title: string;
  time: string;
  type: "task" | "assessment" | "appointment";
  enabled: boolean;
}

export const Reminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminder, setNewReminder] = useState({
    title: "",
    time: "",
    type: "task" as const,
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("reminders");
    if (saved) {
      setReminders(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    const checkReminders = setInterval(async () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      for (const reminder of reminders) {
        if (reminder.enabled && reminder.time === currentTime) {
          toast.info(`Reminder: ${reminder.title}`, {
            description: `Time for your ${reminder.type}`,
            duration: 5000,
          });
          
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("AutiCare Reminder", {
              body: `${reminder.title} - ${reminder.type}`,
              icon: "/favicon.ico",
            });
          }
          
          // Send email notification
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.email) {
            supabase.functions.invoke('send-notification', {
              body: {
                email: user.email,
                type: reminder.type === 'appointment' ? 'appointment' : 'reminder',
                data: {
                  title: reminder.title,
                  description: `Time for your ${reminder.type}`,
                  time: reminder.time,
                },
              },
            }).catch(err => console.error('Failed to send email:', err));
          }
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkReminders);
  }, [reminders]);

  const requestNotificationPermission = () => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  const addReminder = () => {
    if (!newReminder.title || !newReminder.time) {
      toast.error("Please fill in all fields");
      return;
    }

    const reminder: Reminder = {
      id: Date.now().toString(),
      ...newReminder,
      enabled: true,
    };

    setReminders([...reminders, reminder]);
    setNewReminder({ title: "", time: "", type: "task" });
    setIsOpen(false);
    requestNotificationPermission();
    toast.success("Reminder added successfully");
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
    toast.success("Reminder deleted");
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "task": return "bg-primary/10 text-primary";
      case "assessment": return "bg-accent/10 text-accent-foreground";
      case "appointment": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Reminders & Notifications
            </CardTitle>
            <CardDescription>
              Set up alerts for tasks, assessments, and appointments
            </CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Reminder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Reminder</DialogTitle>
                <DialogDescription>
                  Set up a notification for your scheduled activities
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Morning Routine"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newReminder.type}
                    onValueChange={(value: any) => setNewReminder({ ...newReminder, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="task">Task</SelectItem>
                      <SelectItem value="assessment">Assessment</SelectItem>
                      <SelectItem value="appointment">Appointment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addReminder} className="w-full">
                  Create Reminder
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reminders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No reminders set yet</p>
              <p className="text-sm">Click "Add Reminder" to create one</p>
            </div>
          ) : (
            reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-3">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{reminder.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">{reminder.time}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(reminder.type)}`}>
                        {reminder.type}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteReminder(reminder.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
