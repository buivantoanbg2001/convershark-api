

export function gen_user_id(name: string): string {
    let rand_num = Math.floor(Math.random() * 10000) + 1;
    let user_id = name + "#" + String(rand_num).padStart(4, '0');
    return user_id;
}