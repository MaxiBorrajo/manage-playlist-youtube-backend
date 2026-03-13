import { Injectable } from "@nestjs/common";
import { PlaylistItem } from "../models/playlistItem.model";
import { BaseRepository } from "src/shared/database/base.repository";
import { EntityManager } from "@mikro-orm/postgresql";

@Injectable()
export class PlaylistItemRepository extends BaseRepository<PlaylistItem> {
  constructor(em: EntityManager) {
    super(em, PlaylistItem);
  }
}
