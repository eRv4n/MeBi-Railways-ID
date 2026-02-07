import { System, world } from "@minecraft/server";

const TRAINS_ID = [
    "mbr:loc_id206",
    "minecraft:cow",
    "mbr:loc_id208",
];

const RAIL_ID = "mbr:stone_rail";
const SEARCH_RADIUS = 3;

world.afterEvents.entitySpawn.subscribe((e) => {
    const entity = e.entity;
    const dim = entity.dimension;
    const pos = entity.location;

    if (TRAINS_ID.includes(entity.typeId) == false ) return
    if (entity.hasTag("trainSnapped")) return
    console.log(entity.location.x, entity.location.y, entity.location.z);

    let foundRail = null;

    for (let x = -SEARCH_RADIUS; x <= SEARCH_RADIUS; x++) {
        for (let y = -1; y <= 1; y++) {
            for (let z = -SEARCH_RADIUS; z <= SEARCH_RADIUS; z++) {
                const block = dim.getBlock({
                    x: Math.floor(pos.x + x),
                    y: Math.floor(pos.y + y),
                    z: Math.floor(pos.z + z),
                });

                if (block && block.typeId === RAIL_ID) {
                    // found rail berubah jasi block rail terdekat
                    foundRail = block;
                    break;
                }
            }
            if (foundRail) break;
        }
        if (foundRail) break;
    }

    // Tidak ada rail sama sekali → hapus entity
    if (!foundRail) {
        entity.kill();
        return;
    }

    const direction = foundRail.permutation.getState("minecraft:cardinal_direction");

    let yaw = 0;

    switch (direction) {
        case "north":
            yaw = 180;
            break;
        case "south":
            yaw = 0;
            break;
        case "west":
            yaw = 90;
            break;
        case "east":
            yaw = -90;
            break;
    }


    // Snap ke rail terdekat
    entity.teleport(
        {
            x: foundRail.location.x + 0.5,
            y: foundRail.location.y + 0.1,
            z: foundRail.location.z + 0.5,
        },
        { 
            rotation: { x: 0, y: yaw }
        }
    );
    
    entity.addTag("trainSnapped");
})