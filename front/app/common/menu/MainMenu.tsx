import {getAllPages} from "@/app/page/service";
import {defaultItems, MenuItem} from "@/app/common/menu/types";
import {HeaderWithMenu} from "@/app/common/menu/HeaderWithMenu";

export default async function MainMenu() {
    const pages = await getAllPages();

    const menuItems: MenuItem[] = [...pages]
        .sort((a, b) => a.Sort - b.Sort)
        .map(m => {
            const it = m as MenuItem;
            if (!it.IsCustom) {
                it.Url = `/page/${it.Url}`;
            }
            return it;
        });

    return (
        <HeaderWithMenu menuItems={menuItems} />
    );
}