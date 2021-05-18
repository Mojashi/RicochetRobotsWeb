sudo add-apt-repository ppa:longsleep/golang-backports
sudo apt update
sudo apt install nodejs golang nginx npm -y
git clone https://github.com/Mojashi/RicochetRobotsWeb
cd RicochetRobotsWeb/front/ricochetrobots-redux
npm install
npm run build