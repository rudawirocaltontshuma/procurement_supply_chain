"use client";

import * as React from "react";

import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { StatusBadge } from "../../_components/status-badge";
import { formatCurrency, initials } from "../../_lib/format";
import { CATEGORIES, users } from "../../_lib/mock-data";

export function SettingsPanels() {
  const [orgName, setOrgName] = React.useState("Nexora Supply Co.");
  const [orgDomain, setOrgDomain] = React.useState("nexorasupply.com");
  const [notifications, setNotifications] = React.useState({
    approvalRequests: true,
    contractExpiry: true,
    lowStock: true,
    invoiceDue: false,
    weeklyDigest: true,
  });
  const [thresholds, setThresholds] = React.useState({
    manager: 10_000,
    director: 50_000,
    executive: 250_000,
  });

  function save(section: string) {
    toast("Settings saved", { description: `${section} preferences have been updated.` });
  }

  return (
    <Tabs defaultValue="organization">
      <TabsList className="flex-wrap">
        <TabsTrigger value="organization">Organization</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="approvals">Approval Thresholds</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
      </TabsList>

      <TabsContent value="organization">
        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-sm">Organization Profile</CardTitle>
            <CardDescription>Basic details shown across the Nexora Supply workspace.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:max-w-md">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="org-name">Organization name</Label>
              <Input id="org-name" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="org-domain">Primary domain</Label>
              <Input id="org-domain" value={orgDomain} onChange={(e) => setOrgDomain(e.target.value)} />
            </div>
            <Button className="w-fit" onClick={() => save("Organization")}>
              Save changes
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-sm">Notification Preferences</CardTitle>
            <CardDescription>Choose which events send a notification.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:max-w-md">
            {(
              [
                { key: "approvalRequests", label: "New approval requests" },
                { key: "contractExpiry", label: "Contract expiring soon" },
                { key: "lowStock", label: "Low stock alerts" },
                { key: "invoiceDue", label: "Invoice due reminders" },
                { key: "weeklyDigest", label: "Weekly summary digest" },
              ] as const
            ).map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <Label htmlFor={item.key} className="font-normal">
                  {item.label}
                </Label>
                <Switch
                  id={item.key}
                  checked={notifications[item.key]}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, [item.key]: checked }))}
                />
              </div>
            ))}
            <Button className="w-fit" onClick={() => save("Notification")}>
              Save preferences
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="approvals">
        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-sm">Approval Thresholds</CardTitle>
            <CardDescription>Spend limits that require escalation to the next approval level.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:max-w-md">
            {(
              [
                { key: "manager", label: "Manager approval up to" },
                { key: "director", label: "Director approval up to" },
                { key: "executive", label: "Executive approval up to" },
              ] as const
            ).map((item) => (
              <div key={item.key} className="flex flex-col gap-1.5">
                <Label htmlFor={item.key}>{item.label}</Label>
                <Input
                  id={item.key}
                  type="number"
                  value={thresholds[item.key]}
                  onChange={(e) => setThresholds((prev) => ({ ...prev, [item.key]: Number(e.target.value) }))}
                />
                <p className="text-muted-foreground text-xs">{formatCurrency(thresholds[item.key])}</p>
              </div>
            ))}
            <Button className="w-fit" onClick={() => save("Approval threshold")}>
              Save thresholds
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="categories">
        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-sm">Spend Categories</CardTitle>
            <CardDescription>Categories used to classify purchase requests, orders, and contracts.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <Badge key={category} variant="secondary">
                {category}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="users">
        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-sm">Workspace Users</CardTitle>
            <CardDescription>People with access to Nexora Supply.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-7">
                          <AvatarFallback className="text-[10px]">{initials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-muted-foreground text-xs">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{user.role}</TableCell>
                    <TableCell className="text-sm">{user.department}</TableCell>
                    <TableCell>
                      <StatusBadge status={user.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
