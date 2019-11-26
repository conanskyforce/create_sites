
mountGoo(){
  if [ ! -n "$1" ];then echo 'need one parameter ! ' exit
  else
  echo "rclone mount $1!"
  export http_proxy=http://127.0.0.1:1087 && export https_proxy=http://127.0.0.1:1087 && proxychains4 rclone mount $1: "/root/$1" --allow-other --allow-non-empty --vfs-cache-mode writes &
  fi
}

if [ ! -n "$1" ];then echo 'need one parameter ! ' exit
else
  mountGoo $1
fi
