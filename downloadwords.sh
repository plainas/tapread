curl https://larare.at/svenska/moment/lingvistik/vanligaste_orden_i_svenska_spraket.html | tq -t "ol li" | awk '{$1=$1; print}' > common_sv_words.txt
