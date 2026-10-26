# frontend: 192.168.56.12

Angular budowany na Windowsie, na VM tylko nginx z gotowymi plikami.

## Build (Windows)
```powershell
cd app/frontend
npm ci
npm run build
scp -r dist/frontend/browser student@192.168.56.12:/tmp/notes
```

## nginx
```bash
sudo apt install -y nginx
sudo rm -rf /var/www/notes
sudo mv /tmp/notes /var/www/notes
sudo chown -R root:root /var/www/notes
sudo chmod -R a+rX /var/www/notes
```
Bez chmod nginx zwraca 403 (scp z Windowsa zakłada katalog z prawami tylko dla właściciela).

`/etc/nginx/sites-available/default`:
```nginx
server {
    listen 80 default_server;
    root /var/www/notes;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://192.168.56.11:8000;
    }
}
```
```bash
sudo nginx -t && sudo systemctl reload nginx
```

## Firewall
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw enable
```

## Testy
- przeglądarka: http://192.168.56.12 -> dodanie notatki działa
- `ssh root@192.168.56.1X` -> odrzucone
- logi: `sudo tail -f /var/log/nginx/error.log`
