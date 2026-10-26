# backend: 192.168.56.11

FastAPI + uvicorn, kod w `app/backend`.

## Kod
Z Windowsa:
```powershell
scp app/backend/main.py app/backend/requirements.txt student@192.168.56.11:/tmp/
```
Na backendzie:
```bash
sudo apt install -y python3-venv
sudo useradd -r -s /usr/sbin/nologin api
sudo mkdir -p /opt/api
sudo mv /tmp/main.py /tmp/requirements.txt /opt/api/
sudo python3 -m venv /opt/api/venv
sudo /opt/api/venv/bin/pip install -r /opt/api/requirements.txt
```

## Usługa
`/etc/systemd/system/api.service`:
```ini
[Unit]
Description=Notes API
After=network-online.target

[Service]
User=api
WorkingDirectory=/opt/api
Environment=DATABASE_URL=postgresql://app:<haslo>@192.168.56.10/appdb
ExecStart=/opt/api/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now api
curl localhost:8000/api/notes   # []
```

## Firewall
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow from 192.168.56.12 to any port 8000 proto tcp
sudo ufw enable
```

## Testy
- z Windowsa: `Test-NetConnection 192.168.56.11 -Port 8000` -> False
- logi: `sudo journalctl -u api -f`
