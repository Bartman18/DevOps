# Maszyna bazowa

Wspólne dla wszystkich VM.

## VirtualBox
- ISO: ubuntu-24.04-live-server-amd64.iso
- 2048 MB RAM, 2 CPU, dysk 20 GB
- Skip Unattended Installation
- Adapter 1: NAT
- Adapter 2: Host-only Adapter (192.168.56.0/24)
- Instalator: Ubuntu Server, zaznaczony OpenSSH server

## Pakiety
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 ufw
```

## SSH: blokada roota
```bash
echo "PermitRootLogin no" | sudo tee /etc/ssh/sshd_config.d/99-hardening.conf
sudo systemctl restart ssh
sudo sshd -T | grep permitrootlogin
```

## Klonowanie
- Oryginał: backend, klony: db i frontend
- Clone -> Full clone, Generate new MAC addresses for all network adapters

Na klonach nowy machine-id, inaczej wszystkie dostają z DHCP ten sam adres:
```bash
sudo rm /etc/machine-id && sudo systemd-machine-id-setup
```

## Hostname i stały IP
Nazwa karty host-only z `ip -br a`.
```bash
sudo hostnamectl set-hostname <nazwa>
sudo nano /etc/netplan/60-hostonly.yaml
```
```yaml
network:
  version: 2
  ethernets:
    <karta>:
      addresses: [192.168.56.X/24]
```
```bash
sudo chmod 600 /etc/netplan/60-hostonly.yaml
sudo netplan apply
sudo reboot
```

| VM | hostname | IP |
|---|---|---|
| db | db | 192.168.56.10 |
| backend | backend | 192.168.56.11 |
| frontend | frontend | 192.168.56.12 |

## Firewall: reguły wspólne
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
# reguły danej maszyny
sudo ufw enable
```
